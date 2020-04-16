from django.db import models


class Texture(models.Model):
    id = models.AutoField(primary_key=True)
    texture_name = models.TextField(max_length=100, null=False)
    image_size = models.PositiveIntegerField(default=0, null=False)

    bad_count = models.PositiveIntegerField(default=0, null=True)
    dirt_count = models.PositiveIntegerField(default=0, null=True)

    sum_dirt_size = models.PositiveIntegerField(default=0)
    min_dirt_size = models.PositiveIntegerField(default=1224 * 900)
    max_dirt_size = models.PositiveIntegerField(default=0)
    sum_bad_size = models.PositiveIntegerField(default=0)
    min_bad_size = models.PositiveIntegerField(default=1224 * 900)
    max_bad_size = models.PositiveIntegerField(default=0)


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

    texture = models.ForeignKey(to=Texture, on_delete=models.CASCADE, null=True)
