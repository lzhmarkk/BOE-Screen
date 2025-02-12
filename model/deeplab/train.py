import os
import numpy as np
from tqdm import tqdm

from model.deeplab.mypath import Path
from model.deeplab.dataloaders import make_data_loader
from model.deeplab.modeling.sync_batchnorm.replicate import patch_replication_callback
from model.deeplab.modeling.deeplab import *
from model.deeplab.utils.loss import SegmentationLosses
from model.deeplab.utils.calculate_weights import calculate_weigths_labels
from model.deeplab.utils.lr_scheduler import LR_Scheduler
from model.deeplab.utils.saver import Saver
from model.deeplab.utils.summaries import TensorboardSummary
from model.deeplab.utils.metrics import Evaluator


class Trainer(object):
    def __init__(self, args, train=False):
        self.args = args

        # Define Saver
        self.saver = Saver(args)
        self.saver.save_experiment_config()
        # Define Tensorboard Summary
        self.summary = TensorboardSummary(self.saver.experiment_dir)
        self.writer = self.summary.create_summary()
        self.save_dir = os.path.join('../save', 'checkpoint.pth.tar')
        self.cuda = args.cuda
        self.sync_train = args.sync_train
        print("同时训练两个分支" if self.sync_train else "交替训练两个分支")

        # Define Dataloader
        kwargs = {'num_workers': args.workers, 'pin_memory': True}
        if train:
            self.train_loader, self.val_loader, self.test_loader, self.nclass = make_data_loader(args, **kwargs)
        else:
            self.nclass = 3

        # Define network
        model = DeepLab(num_classes=self.nclass,
                        backbone=args.backbone,
                        output_stride=args.out_stride,
                        sync_bn=args.sync_bn,
                        freeze_bn=args.freeze_bn)
        # 梯度全开
        train_params = [{'params': model.get_1x_lr_params(), 'lr': args.lr},
                        {'params': model.get_10x_lr_params(), 'lr': args.lr * 10}]
        # 关闭2的梯度
        model.set_requires_grad([2], False)
        train_params1 = [{'params': model.get_1x_lr_params(), 'lr': args.lr},
                         {'params': model.get_10x_lr_params(), 'lr': args.lr * 10}]
        # 打开2的梯度，关闭1的梯度
        model.set_requires_grad([1, 2], True)
        model.set_requires_grad([1], False)
        train_params2 = [{'params': model.get_1x_lr_params(), 'lr': args.lr},
                         {'params': model.get_10x_lr_params(), 'lr': args.lr * 10}]
        model.set_requires_grad([1, 2], True)

        # Define Optimizer
        self.optimizer = torch.optim.SGD(train_params, momentum=args.momentum,
                                         weight_decay=args.weight_decay, nesterov=args.nesterov)
        self.optimizer1 = torch.optim.SGD(train_params1, momentum=args.momentum,
                                          weight_decay=args.weight_decay, nesterov=args.nesterov)
        self.optimizer2 = torch.optim.SGD(train_params2, momentum=args.momentum,
                                          weight_decay=args.weight_decay, nesterov=args.nesterov)
        # Define Criterion
        # whether to use class balanced weights
        if args.use_balanced_weights:
            classes_weights_path = os.path.join(Path.db_root_dir(args.dataset), args.dataset + '_classes_weights.npy')
            if os.path.isfile(classes_weights_path):
                weight = np.load(classes_weights_path)
            else:
                weight = calculate_weigths_labels(args.dataset, self.train_loader, self.nclass)
            weight = torch.from_numpy(weight.astype(np.float16))
        else:
            weight = None
        self.criterion1 = SegmentationLosses(weight=weight, cuda=args.cuda).build_loss(mode=args.loss_type)
        self.criterion2 = SegmentationLosses(weight=weight, cuda=args.cuda).build_loss(mode=args.loss_type)
        self.model = model

        # Define Evaluator
        self.evaluator1 = Evaluator(self.nclass)
        self.evaluator2 = Evaluator(self.nclass)
        # Define lr scheduler
        self.scheduler = LR_Scheduler(args.lr_scheduler, args.lr,
                                      args.epochs, len(self.train_loader) if train else 4)
        self.scheduler1 = LR_Scheduler(args.lr_scheduler, args.lr,
                                       args.epochs, len(self.train_loader) if train else 4)
        self.scheduler2 = LR_Scheduler(args.lr_scheduler, args.lr,
                                       args.epochs, len(self.train_loader) if train else 4)

        # Using cuda
        if args.cuda:
            self.model = torch.nn.DataParallel(self.model, device_ids=self.args.gpu_ids)
            patch_replication_callback(self.model)
            self.model = self.model.cuda()

        # Resuming checkpoint
        self.best_pred = 0.0
        if args.resume is not None:
            if not os.path.isfile(args.resume):
                raise RuntimeError("=> no checkpoint found at '{}'".format(args.resume))
            checkpoint = torch.load(args.resume)
            args.start_epoch = checkpoint['epoch']
            if args.cuda:
                self.model.module.load_state_dict(checkpoint['state_dict'])
            else:
                self.model.load_state_dict(checkpoint['state_dict'])
            if not args.ft:
                self.optimizer.load_state_dict(checkpoint['optimizer'])
            self.best_pred = checkpoint['best_pred']
            print("=> loaded checkpoint '{}' (epoch {})"
                  .format(args.resume, checkpoint['epoch']))

        # Clear start epoch if fine-tuning
        if args.ft:
            args.start_epoch = 0

    def training(self, epoch):
        train_loss1, train_loss2 = 0.0, 0.0
        self.model.train()
        tbar = tqdm(self.train_loader)
        num_img_tr = len(self.train_loader)
        for i, sample in enumerate(tbar):
            image, target, category = sample['image'], sample['label'], sample['category']
            if self.args.cuda:
                image, target, category = image.cuda(), target.cuda(), category.cuda()
            if self.sync_train:
                # 同时训练两个分支
                output_mask, output_category = self.model(image)
                loss1 = self.criterion1(output_mask, target)
                loss2 = self.criterion2(output_category, category)
                self.scheduler(self.optimizer, i, epoch, self.best_pred)
                self.optimizer.zero_grad()
                loss = loss1 + loss2
                loss.backward()
                self.optimizer.step()
            else:
                # 交替训练两个分支
                self.model.module.set_requires_grad([2], False)
                output_mask, output_category = self.model(image)
                loss1 = self.criterion1(output_mask, target)
                self.scheduler1(self.optimizer1, i, epoch, self.best_pred)
                self.optimizer1.zero_grad()
                loss1.backward()
                self.optimizer1.step()

                self.model.module.set_requires_grad([1, 2], True)
                self.model.module.set_requires_grad([1], False)
                output_mask, output_category = self.model(image)
                loss2 = self.criterion2(output_category, category)
                self.scheduler2(self.optimizer2, i, epoch, self.best_pred)
                self.optimizer2.zero_grad()
                loss2.backward()
                self.optimizer2.step()

            train_loss1 += loss1.item()
            train_loss2 += loss2.item()
            if i == 0:
                self.summary.visualize_image(self.writer, self.args.dataset, image, target, output_mask,
                                             epoch * 1000 + i)
            tbar.set_description('Train loss: %.3f/%.3f' % (train_loss1 / (i + 1), train_loss2 / (i + 1)))

        print('[Epoch: %d, numImages: %5d]' % (epoch, i * self.args.batch_size + image.data.shape[0]))
        print('Loss: %.3f/%.3f' % (train_loss1, train_loss2))

    def validation(self, epoch):
        self.model.eval()
        self.evaluator1.reset()
        self.evaluator2.reset()
        tbar = tqdm(self.val_loader, desc='\r')
        test_loss1, test_loss2 = 0.0, 0.0
        dic = {"11": 0, "12": 0, "21": 0, "22": 0}
        reliability_sum = 0
        reliability_count = 0
        for i, sample in enumerate(tbar):
            image, target, category = sample['image'], sample['label'], sample['category']
            if self.args.cuda:
                image, target, category = image.cuda(), target.cuda(), category.cuda()
            with torch.no_grad():
                output_mask, output_category = self.model(image)
            loss1 = self.criterion1(output_mask, target)
            loss2 = self.criterion2(output_category, category)
            test_loss1 += loss1.item()
            test_loss2 += loss2.item()
            tbar.set_description('Test loss: %.3f/%.3f' % (test_loss1 / (i + 1), test_loss2 / (i + 1)))
            pred1, pred2 = output_mask.data.cpu().numpy(), output_category.data.cpu().numpy()
            target1, target2 = target.cpu().numpy(), category.cpu().numpy()
            pred1, pred2 = np.argmax(pred1, axis=1), np.argmax(pred2, axis=1)
            # Add batch sample into evaluator
            self.evaluator1.add_batch(target1, pred1)
            self.evaluator2.add_batch(target2, pred2)

            res = {}
            # pred: batch_size * h * w
            for index in range(pred2.shape[0]):  # 对一个batch内的每一张图片
                target_category_mask, pred_category_mask = target2[index], pred2[index]  # 预测的分类
                # pred_classes 1和2的统计
                _except_class, pred_classes = np.unique(target_category_mask), np.bincount(
                    pred_category_mask.reshape(1, -1).squeeze())
                # 概率最大的分类
                _pred_class = np.argmax(pred_classes)
                # 可信度
                reliability = pred_classes[_pred_class] / pred_classes.sum()
                res[index] = (_except_class.astype('uint').tolist(), _pred_class, 100 * reliability)
                if _except_class != 0 and _pred_class != 0:
                    if _except_class == 1 and _pred_class == 1:
                        dic["11"] += 1
                    elif _except_class == 1 and _pred_class == 2:
                        dic["12"] += 1
                    elif _except_class == 2 and _pred_class == 1:
                        dic["21"] += 1
                    elif _except_class == 2 and _pred_class == 2:
                        dic["22"] += 1
                reliability_sum += reliability
                reliability_count += 1
            # print("当前({}, {})：分类状态(期望,预测,可信度)：{}".format(epoch, i, res))
            print("reliability mean", reliability_sum / reliability_count)

        # Fast test during the training
        Acc = self.evaluator1.Pixel_Accuracy()
        Acc_class = self.evaluator1.Pixel_Accuracy_Class()
        mIoU = self.evaluator1.Mean_Intersection_over_Union()
        FWIoU = self.evaluator1.Frequency_Weighted_Intersection_over_Union()
        Acc2 = self.evaluator2.Pixel_Accuracy()
        Acc_class2 = self.evaluator2.Pixel_Accuracy_Class()
        mIoU2 = self.evaluator2.Mean_Intersection_over_Union()
        FWIoU2 = self.evaluator2.Frequency_Weighted_Intersection_over_Union()
        print('Validation:')
        print('[Epoch: %d, numImages: %5d]' % (epoch, i * self.args.batch_size + image.data.shape[0]))
        print("Acc:{}, Acc_class:{}, mIoU:{}, fwIoU: {}".format(Acc, Acc_class, mIoU, FWIoU))
        print("Acc2:{}, Acc_class2:{}, mIoU2:{}, fwIoU2: {}".format(Acc2, Acc_class2, mIoU2, FWIoU2))
        print('Loss: %.3f/%.3f' % (test_loss1, test_loss2))
        print('Dic: ', dic)

        new_pred = mIoU
        if new_pred > self.best_pred:
            is_best = True
            self.best_pred = new_pred
            self.save_checkpoint()

    def run(self, image):
        """
        :param image: 待检测一张图片
        :return: mask
        """
        from model.deeplab.dataloaders.datasets.my_dataset import transform

        # 读取预训练模型
        self.load_checkpoint()
        self.model.eval()
        self.evaluator1.reset()
        # 处理输入
        # image = [].append(image)
        sample = transform({'image': image, 'label': None, 'category': None})
        image = sample['image']
        # 拼接成指定大小
        # image = torch.stack([image for _ in range(self.args.batch_size)])
        image = torch.stack([image])
        if self.args.cuda:
            image = image.cuda()
        with torch.no_grad():
            output_mask, output_category = self.model(image)

        # 处理输出
        # output = output[:1]
        rgb_mask = torch.max(output_mask[0], 0)[1].detach().cpu().numpy()
        # rgb_category = torch.max(output_category[0], 0)[1].detach().cpu().numpy()
        pred_category_mask = np.argmax(output_category.data.cpu().numpy(), axis=1)[0]
        pred_classes = np.bincount(pred_category_mask.reshape(1, -1).squeeze())
        return np.array(rgb_mask), pred_classes

    def save_checkpoint(self):
        if not os.path.exists('../../save'):
            os.makedirs('../../save')
        torch.save({
            'state_dict': self.model.module.state_dict(),
            'optimizer': self.optimizer.state_dict(),
            'best_pred': self.best_pred
        }, self.save_dir)
        print("=> save checkpoint to '{}'".format(self.save_dir))

    def load_checkpoint(self):
        if not os.path.isfile(self.save_dir):
            raise RuntimeError("=> no checkpoint found at '{}'".format(self.save_dir))
        checkpoint = torch.load(self.save_dir) if torch.cuda.is_available() \
            else torch.load(self.save_dir, map_location=torch.device('cpu'))
        if self.cuda:
            self.model.module.load_state_dict(checkpoint['state_dict'])
        else:
            self.model.load_state_dict(checkpoint['state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer'])
        self.best_pred = checkpoint['best_pred']
        print("=> loaded checkpoint from '{}'".format(self.save_dir))
