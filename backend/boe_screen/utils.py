import torch
import numpy


def get_mask(image, analyze=True):
    """
    取得image的mask等信息
    :param image:(PIL Image)
    :return: mask
    """
    assert len(image.shape) == 3 and image.shape[0] == 3
    # shape: h x w
    if analyze:
        shape = image.shape[1:]
        # use model
        image = _to_tensor(image)
        # image:torch.tensor
        mask = torch.max(image, 1)[0]  # todo:use model
        dict = get_class_dict(mask, shape)
        return mask, _max(dict), dict
    else:
        return None, 0, {}


def get_class_dict(mask, shape):
    """
    :param mask: 二维像素图
    :param shape: 图片长宽Tuple
    :return:dict: 预测的mask中各类别的像素数（代表着mask为该类别的概率）
    """
    assert mask.shape == shape
    classes = torch.unique(mask)
    classes = classes[1:]  # ignore background
    masks = mask == classes[:, None, None]

    dict = {}
    for _class in classes:
        dict[_class] = masks[_class].sum()

    return dict


def _to_tensor(img):
    """
    :param img:PIL Image
    :return: img:torch.tensor
    """
    # swap color axis because
    # numpy image: H x W x C
    # torch image: C x H x W
    img = numpy.array(img).astype(numpy.float32).transpose((2, 0, 1))
    img = torch.from_numpy(img).float()
    return img


def _max(dict):
    """
    获取某个dict中value最大对应的key
    :param dict
    :return: key
    """
    max_class, max_value = 0, 0
    for i, _class in enumerate(dict):
        if max_value < dict[_class]:
            max_value = dict[_class]
            max_class = _class
    return max_class
