from django.db import models


class ProdLine(models.Model):
    id = models.AutoField(primary_key=True)
    prod_line_name = models.TextField(max_length=100, null=False)
    image_size = models.PositiveIntegerField(default=0, null=False)

    count1 = models.PositiveIntegerField(default=0, null=True)
    count2 = models.PositiveIntegerField(default=0, null=True)


class Image(models.Model):
    id = models.AutoField(primary_key=True)
    image_name = models.TextField(max_length=100, null=False)
    image = models.TextField(null=True)
    time = models.DateTimeField(null=True)
    mask = models.TextField(null=True)
    pred = models.PositiveIntegerField(null=True)
    size = models.TextField(max_length=20, null=True)
    area = models.IntegerField(default=0)

    weight1 = models.PositiveIntegerField(null=True)
    weight2 = models.PositiveIntegerField(null=True)

    prod_line = models.ForeignKey(to=ProdLine, on_delete=models.CASCADE, null=True)


# unused
class ProdLineClass(models.Model):
    """
    某个生产线上，各种类别的图片的占比
    （在更新生产线时更新，便于查询）
    """
    name = models.CharField(max_length=10, null=False)
    value = models.PositiveIntegerField(default=0, null=False)
    prod_line = models.ForeignKey(to=ProdLine, on_delete=models.CASCADE, null=False)


# unused
class ImageClass(models.Model):
    """
    某个Mask中预测得的各种类的权重
    """
    name = models.CharField(max_length=10, null=False)
    value = models.PositiveIntegerField(null=False)
    image = models.ForeignKey(to=Image, on_delete=models.CASCADE, null=False)
