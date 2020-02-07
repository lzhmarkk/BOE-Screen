from django.db import models


class Image(models.Model):
    image_name = models.TextField(max_length=100)
    image = models.ImageField()
    time = models.DateTimeField()


class Mask(models.Model):
    mask = models.ImageField()

    image = models.OneToOneField(to=Image, on_delete=models.CASCADE, null=False)
