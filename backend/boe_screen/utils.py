import torch
import numpy
from model.deeplab.main import analyze_image
from model.deeplab.dataloaders.utils import decode_segmap


def get_mask(image, analyze=True):
    """
    取得image的mask等信息
    :param image:(PIL Image)
    :return: mask
    """
    # shape: h x w
    if analyze:
        # use model
        mask = analyze_image(image)
        # mask (numpy array) h x w
        dict = get_class_dict(mask, mask.shape)
        mask = decode_segmap(mask, dataset='mydataset')
        mask = mask * 255
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
    classes = numpy.unique(mask)
    classes = classes[1:]  # ignore background
    masks = mask == classes[:, None, None]

    dict = {}
    for i, _class in enumerate(classes):
        dict[_class] = masks[i].sum()

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


if __name__ == '__main__':
    # test
    from PIL import Image
    import os
    from io import BytesIO
    import base64

    # test 先图片转化成base64,再测试从base64转化成图片并获取mask
    img = Image.open(os.path.join('/run/media/lzhmark/shared/boe-screen/all/images/19k-Final-9941-1',
                                  '1a54960042mcj_1065_448_1.jpg'))
    output_buffer = BytesIO()
    img.save(output_buffer, format('JPEG'))
    base64_data = base64.b64encode(output_buffer.getvalue())
    print(base64_data)
    img = Image.open(BytesIO(base64.b64decode(base64_data)))
    # img.show("转换后的Image")
    mask, pred, weights = get_mask(img, analyze=True)

    # 展示结果
    mask = Image.fromarray(mask.astype('uint8'))
    mask.show("得到的mask")
    print("预测", pred)
    print("权重", weights)
    exit(0)
