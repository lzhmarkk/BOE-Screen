import torch
import numpy
import re
import base64
import os
from model.deeplab.main import analyze_image
from model.deeplab.dataloaders.utils import decode_segmap
from PIL import Image as _Image
from io import BytesIO


def get_mask(image, analyze=True):
    """
    取得image的mask等信息
    :param image:(PIL Image)
    :return: mask 图片的mask
             dict mask中各类的像素数
             area mask的大小
    """
    # shape: h x w
    if analyze:
        # use model
        mask = analyze_image(image)
        # mask (numpy array) h x w
        dict = get_class_dict(mask, mask.shape)
        area = get_area(mask)
        mask = decode_segmap(mask, dataset='mydataset')
        mask = mask * 255
        return mask, _max(dict), dict, area
    else:
        _image = numpy.array(image)
        return image, 0, {}, _image.shape[0] * _image.shape[1]


def get_class_dict(mask, shape):
    """
    :param mask: 二维像素图
    :param shape: 图片长宽Tuple
    :return:dict: 预测的mask中各类别的像素数（代表着mask为该类别的概率）
    """
    assert mask.shape == shape
    classes = numpy.unique(mask)
    classes = classes[1:]  # ignore background
    masks = mask == classes[:, None, None]

    dict = {}
    for i, _class in enumerate(classes):
        dict[_class] = masks[i].sum()

    return dict


def get_area(img):
    h, w = img.shape
    return h * w


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


def pil2base(pil, ext):
    """
    :param pil: PIL Image
    :param ext: 图片后缀名PNG/jpeg
    :return: base64格式的图片
    """
    output_buffer = BytesIO()
    pil.save(output_buffer, format(ext))
    return "data:image/png;base64," + (base64.b64encode(output_buffer.getvalue())).decode()


def base2pil(base):
    """
    :param base: base64格式的图片
    :return: PIL格式的图片
    """
    base64_data = re.sub('^data:image/.+;base64,', '', base)
    return _Image.open(BytesIO(base64.b64decode(base64_data)))


if __name__ == '__main__':
    # test 先图片转化成base64,再测试从base64转化成图片并获取mask
    img = _Image.open(os.path.join('/run/media/lzhmark/shared/boe-screen/all/images/19k-Final-9941-1',
                                   '1a54960042mcj_1065_448_1.jpg'))

    base64_data = pil2base(img, 'jpeg')
    print(base64_data)
    img = base2pil(base64_data)
    img.show("转换后的Image")
    mask, pred, weights, area = get_mask(img, analyze=False)

    # 展示结果
    if mask is not None:
        mask = _Image.fromarray(mask.astype('uint8'))
        mask.show("得到的mask")
    print("预测", pred)
    print("权重", weights)
    print("面积", area)
    exit(0)
