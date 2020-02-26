import argparse
import torch
from PIL import Image


def _init_args(dataset='mydataset', epochs=10, batch_size=4, lr=0.007, classify=False, sync_train=True):
    assert dataset in ['mydataset', 'penn', 'all']
    assert epochs >= 0
    assert batch_size >= 0
    assert lr >= 0
    assert classify in [True, False]

    parser = argparse.ArgumentParser(description="PyTorch DeeplabV3Plus Training")
    args = parser.parse_args()
    args.backbone = 'resnet'
    args.out_stride = 16
    args.dataset = dataset
    args.use_sbd = True
    args.workers = 1
    args.base_size = 513
    args.crop_size = 513
    args.sync_bn = None
    args.freeze_bn = False
    args.loss_type = 'ce'
    args.epochs = epochs
    args.start_epoch = 0
    args.batch_size = batch_size
    args.test_batch_size = 4
    args.use_balanced_weights = False
    args.lr = lr
    args.lr_scheduler = 'poly'
    args.momentum = 0.9
    args.weight_decay = 5e-4
    args.nesterov = False
    args.no_cuda = False
    args.gpu_ids = '0'
    args.seed = 1
    args.resume = None
    args.checkname = 'deeplab-' + str(args.backbone)
    args.ft = False
    args.eval_interval = 1
    args.no_val = False
    args.classify = classify
    args.sync_train = sync_train

    args.cuda = not args.no_cuda and torch.cuda.is_available()
    if args.cuda:
        try:
            args.gpu_ids = [int(s) for s in args.gpu_ids.split(',')]
        except ValueError:
            raise ValueError('Argument --gpu_ids must be a comma-separated list of integers only')
    if args.cuda and len(args.gpu_ids) > 1:
        args.sync_bn = True
    else:
        args.sync_bn = False

    return args


def train_model():
    """
    训练模型
    """
    from model.deeplab.train import Trainer

    args = _init_args(dataset='all', epochs=50, batch_size=4, lr=0.007, classify=True, sync_train=True)
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
    args = _init_args(dataset='all', epochs=50, batch_size=4, lr=0.007, classify=True, sync_train=True)
    print(args)
    torch.manual_seed(args.seed)
    trainer = Trainer(args)
    mask = trainer.run(image)
    trainer.writer.close()
    return mask


if __name__ == "__main__":
    import sys

    # 这样就可以直接命令行跑了
    sys.path.extend('./')
    train_model()
