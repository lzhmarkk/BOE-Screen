import torch
from PIL import Image


class Arg(object):
    def __init__(self, dataset='all', epochs=10, batch_size=8, lr=0.007, classify=True, sync_train=True):
        assert dataset in ['mydataset', 'penn', 'all']
        assert epochs >= 0
        assert batch_size >= 0
        assert lr >= 0
        assert classify in [True, False]

        self.backbone = 'resnet'
        self.out_stride = 16
        self.dataset = dataset
        self.use_sbd = True
        self.workers = 1
        self.base_size = 513
        self.crop_size = 513
        self.sync_bn = None
        self.freeze_bn = False
        self.loss_type = 'ce'
        self.epochs = epochs
        self.start_epoch = 0
        self.batch_size = batch_size
        self.test_batch_size = 4
        self.use_balanced_weights = False
        self.lr = lr
        self.lr_scheduler = 'poly'
        self.momentum = 0.9
        self.weight_decay = 5e-4
        self.nesterov = False
        self.no_cuda = False
        self.gpu_ids = '0'
        self.seed = 1
        self.resume = None
        self.checkname = 'deeplab-' + str(self.backbone)
        self.ft = False
        self.eval_interval = 1
        self.no_val = False
        self.classify = classify
        self.sync_train = sync_train

        self.cuda = not self.no_cuda and torch.cuda.is_available()
        if self.cuda:
            try:
                self.gpu_ids = [int(s) for s in self.gpu_ids.split(',')]
            except ValueError:
                raise ValueError('Argument --gpu_ids must be a comma-separated list of integers only')
        if self.cuda and len(self.gpu_ids) > 1:
            self.sync_bn = True
        else:
            self.sync_bn = False


def train_model():
    """
    训练模型
    """
    from model.deeplab.train import Trainer

    args = Arg()
    print(args)
    torch.manual_seed(args.seed)
    trainer = Trainer(args)
    print('Starting Epoch:', trainer.args.start_epoch)
    print('Total Epoches:', trainer.args.epochs)
    for epoch in range(trainer.args.start_epoch, trainer.args.epochs):
        trainer.training(epoch)
        if not trainer.args.no_val and epoch % args.eval_interval == (args.eval_interval - 1):
            trainer.validation(epoch)
    trainer.writer.close()


def analyze_image(image):
    """
    :param image: PIL Image
    :return: numpy Image
    务必选择和训练时一样的参数
    """
    from model.deeplab.train import Trainer

    assert isinstance(image, Image.Image)
    args = Arg()
    print(args)
    torch.manual_seed(args.seed)
    trainer = Trainer(args, train=False)
    mask, category = trainer.run(image)
    trainer.writer.close()
    return mask, category


if __name__ == "__main__":
    import sys

    # 这样就可以直接命令行跑了
    sys.path.extend('./')
    train_model()
