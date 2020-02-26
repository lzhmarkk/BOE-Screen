import math
import torch
import torch.nn as nn
import torch.nn.functional as F
from model.deeplab.modeling.sync_batchnorm.batchnorm import SynchronizedBatchNorm2d
from model.deeplab.modeling.Sequential import Sequential


class Decoder(nn.Module):
    def __init__(self, num_classes, backbone, BatchNorm):
        super(Decoder, self).__init__()
        if backbone == 'resnet' or backbone == 'drn':
            low_level_inplanes = 256
        elif backbone == 'xception':
            low_level_inplanes = 128
        elif backbone == 'mobilenet':
            low_level_inplanes = 24
        else:
            raise NotImplementedError

        self.conv1 = nn.Conv2d(low_level_inplanes, 48, 1, bias=False)
        self.bn1 = BatchNorm(48)
        self.relu = nn.ReLU()
        self.last_conv1 = Sequential(num_classes, backbone, BatchNorm)
        self.last_conv2 = Sequential(num_classes, backbone, BatchNorm)
        self._init_weight()

    def forward(self, x, low_level_feat):
        low_level_feat = self.conv1(low_level_feat)
        low_level_feat = self.bn1(low_level_feat)
        low_level_feat = self.relu(low_level_feat)

        x = F.interpolate(x, size=low_level_feat.size()[2:], mode='bilinear', align_corners=True)
        x = torch.cat((x, low_level_feat), dim=1)
        x1 = self.last_conv1(x)
        x2 = self.last_conv2(x)

        return x1, x2

    def _init_weight(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                torch.nn.init.kaiming_normal_(m.weight)
            elif isinstance(m, SynchronizedBatchNorm2d):
                m.weight.data.fill_(1)
                m.bias.data.zero_()
            elif isinstance(m, nn.BatchNorm2d):
                m.weight.data.fill_(1)
                m.bias.data.zero_()

    def set_requires_grad(self, modules, mode):
        for module in modules:
            if module == 1:
                self.last_conv1.set_requires_grad(mode)
            elif module == 2:
                self.last_conv2.set_requires_grad(mode)
            else:
                raise NotImplementedError


def build_decoder(num_classes, backbone, BatchNorm):
    return Decoder(num_classes, backbone, BatchNorm)
