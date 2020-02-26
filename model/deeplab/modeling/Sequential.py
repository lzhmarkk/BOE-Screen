import torch.nn as nn


class Sequential(nn.Module):
    def __init__(self, num_classes, backbone, BatchNorm):
        super().__init__()
        self.conv = nn.Sequential(nn.Conv2d(304, 256, kernel_size=3, stride=1, padding=1, bias=False),
                                  BatchNorm(256),
                                  nn.ReLU(),
                                  nn.Dropout(0.5),
                                  nn.Conv2d(256, 256, kernel_size=3, stride=1, padding=1, bias=False),
                                  BatchNorm(256),
                                  nn.ReLU(),
                                  nn.Dropout(0.1),
                                  nn.Conv2d(256, num_classes, kernel_size=1, stride=1))

    def forward(self, x):
        x = self.conv(x)
        return x

    def set_requires_grad(self, mode):
        for p in self.conv.parameters():
            p.requires_grad = mode
