# -*- coding:utf-8 -*-
from torchvision import transforms
from torch.utils.data import Dataset
from PIL import Image
import random
import numpy as np
import os
from model.deeplab.dataloaders import custom_transforms as tr
from model.deeplab.mypath import Path


class MyDataset(Dataset):
    def __init__(self, file_names, dataset):
        self.mean = (0.5071, 0.4867, 0.4408)
        self.stdv = (0.2675, 0.2565, 0.2761)
        self.dir = Path.db_root_dir(dataset)
        self.dataset = dataset
        files = []
        self.classes = list(file_names.keys())
        for _class in self.classes:
            # file_names [(filename0, dir0), (filename1, dir1), (filename2, dir2)...]
            for file_dir in file_names[_class]:
                files.append([file_dir, _class])
        self.files = sorted(files)

    def __getitem__(self, idx):
        _class = self.files[idx][1]
        ext = '.png' if self.dataset == 'all' else '.jpg'
        dir = self.files[idx][0][1]
        file_name = self.files[idx][0][0]
        img = Image.open(os.path.join(self.dir, 'images', dir, file_name + '.jpg')).convert('RGB')
        mask = Image.open(os.path.join(self.dir, 'masks', dir, file_name + ext))
        mask = mask.resize(img.size)  # forced resize
        mask = np.array(mask, dtype=np.uint8)
        mask = self._decode(mask, _class)
        target = Image.fromarray(mask)
        sample = {'image': img, 'label': target}
        return transform(sample)

    def __len__(self):
        return len(self.files)

    def _decode(self, mask, _class):
        mask[mask != 0] = self.classes.index(_class) + 1
        return mask

    @staticmethod
    def apart(test_size, dataset, classify):
        """
        test_size：从每个class值中取多少张作为测试集
        """
        assert 0 < test_size < 1, "比例啦"

        print("本次运行{}分类".format('使用' if classify else '只分割不'))
        # 读取文件名
        file_names = {}
        classes = []
        dir = Path.db_root_dir(dataset)
        for root, dirs, files in os.walk(os.path.join(dir, 'masks')):
            # 如果是/mask的一级子文件夹
            if os.path.split(root)[0] == os.path.join(dir, 'masks'):
                if dataset == 'all':
                    if classify:
                        # 分类True bad和False bad
                        _class = 'false' if 'fix' in os.path.split(root)[1] else 'true'
                    else:
                        # 只有一类
                        _class = 'image'
                    if _class not in classes:
                        classes.append(_class)
                elif dataset == 'mydataset':
                    if classify:
                        _class = os.path.split(root)[1]  # 子文件夹名
                    else:
                        _class = 'image'
                    classes.append(_class)
                else:
                    raise NotImplementedError

                for file in files:
                    if _class not in file_names.keys():
                        file_names[_class] = []
                    file_names[_class].append((os.path.splitext(file)[0], os.path.basename(root)))

        def rand_select(data, size):
            test = []
            index = [i for i in range(len(data))]
            idx = random.sample(index, size)
            for i in idx:
                test.append(data[i])
            train = [data[i] for i in index if i not in idx]
            return train, test

        train_data, test_data = {}, {}
        for _class in classes:
            train_data[_class], test_data[_class] = rand_select(file_names[_class],
                                                                int(len(file_names[_class]) * test_size))
            print("{}：训练{}张，测试{}张".format(_class, len(train_data[_class]), len(test_data[_class])))

        return train_data, test_data


def transform(sample):
    train_transform = transforms.Compose([
        tr.FixedResize(700),  # 如果内存不够就resize到700或者512
        tr.ToTensor(),
    ])
    return train_transform(sample)


if __name__ == '__main__':
    """
    test dataloader
    """
    import matplotlib.pyplot as plt
    from torch.utils.data import DataLoader
    import torchvision
    from model.deeplab.dataloaders.utils import decode_segmap

    _dataset = 'all'  # ['all','mydataset','penn']
    _classify = False

    train_files, _ = MyDataset.apart(0.1, _dataset, classify=_classify)
    dataset = MyDataset(train_files, dataset=_dataset)
    train_loader = DataLoader(dataset, batch_size=16, shuffle=True)

    samples = next(iter(train_loader))


    def printer(images, type):
        if type == 'label':
            for idx, label_mask in enumerate(images):
                plt.title('masks{}'.format(idx))
                plt.imshow(decode_segmap(np.array(label_mask), _dataset))
                plt.show()
        else:
            sample = torchvision.utils.make_grid(images, normalize=True)
            sample = sample.numpy().transpose((1, 2, 0))
            plt.title('images')
            plt.imshow(sample)
            plt.show()


    printer(samples['image'], type='image')
    printer(samples['label'], type='label')
    exit(0)
