from django.db import models


class ProdLine(models.Model):
    id = models.AutoField(primary_key=True)
    prod_line_name = models.TextField(max_length=100, null=False)
    image_size = models.PositiveIntegerField(default=0, null=False)


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    image_name = models.TextField(max_length=100, null=False)
    image = models.ImageField(null=False)
    time = models.DateTimeField(null=False)
    mask = models.ImageField(null=True)
    pred = models.PositiveIntegerField(null=True)

    prod_line = models.ForeignKey(to=ProdLine, on_delete=models.CASCADE, null=True)


class Class(models.Model):
    name = models.CharField(max_length=10, null=False)
    value = models.PositiveIntegerField(null=False)


class ProdLineClass(Class):
    """
    某个生产线上，各种类别的图片的占比
    （在更新生产线时更新，便于查询）
    """
    prod_line = models.ForeignKey(to=ProdLine, on_delete=models.CASCADE, null=False)


class ImageClass(Class):
    """
    某个Mask中预测得的各种类的权重
    """
    image = models.ForeignKey(to=Image, on_delete=models.CASCADE, null=False)
