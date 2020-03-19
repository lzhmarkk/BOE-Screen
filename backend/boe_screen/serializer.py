from abc import ABC

from rest_framework import serializers
from _datetime import datetime
from .models import *


class ProdLineImageSerializer(serializers.ModelSerializer):
    """
    根据Image构造json
    """

    class Meta:
        model = Image
        fields = ['id', 'image_name', 'image', 'time', 'mask', 'pred']


class StatsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image_name', 'image', 'time', 'mask', 'pred']


class ImageWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageClass
        fields = ['name', 'value']


class ProdlineWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageClass
        fields = ['name', 'value']


class StatsWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdLineClass
        fields = ['name', 'value']


class ApiFlowPostSerializer(serializers.ModelSerializer):
    """
    根据Image构造json
    """
    prodline_id = serializers.PrimaryKeyRelatedField(source='prod_line', queryset=ProdLine.objects.all())

    class Meta:
        model = Image
        fields = ['image_name', 'image', 'time', 'mask', 'pred', 'size', 'area', 'prodline_id']

    def create(self, validated_data):
        validated_data['time'] = datetime.now()
        # create image
        img = Image.objects.create(**validated_data)

        weights = validated_data.get('weights')
        prodline = validated_data.get('prod_line')
        if weights is not None:
            for _, _class in enumerate(weights):
                value = weights[_class]
                # create prediction
                ImageClass.objects.create(name=_class, value=value, image=img)
                # update production line
                try:
                    prod_line_class = prodline.prodlineclass_set.get(name=_class)
                    prodline.image_size += 1
                    prodline.save()
                    prod_line_class.value += 1
                    prod_line_class.save()
                except ProdLine.DoesNotExist:
                    # ProdLineClass.objects.create(name=_class, value=1, prod_line=prodline)
                    pass
        return img


class ApiImageGetSerializer(serializers.ModelSerializer):
    """
    根据Image构造json
    """
    weights = ImageWeightSerializer(instance='weights', many=True)

    class Meta:
        model = Image
        fields = ['id', 'image_name', 'image', 'time', 'mask', 'pred']


class ApiProdLineSerializer(serializers.Serializer):
    """
    根据ProdLine构造json
    """
    prod_line_id = serializers.IntegerField()
    prod_line_name = serializers.CharField()
    image_size = serializers.IntegerField()
    images = ProdLineImageSerializer(source='images', many=True)
    weights = ProdlineWeightSerializer(source='weights', many=True)


class ApiStatsSerializer(serializers.Serializer):
    """
    根据ProdLine的images统计
    """
    prod_line_name = serializers.CharField()
    image_size = serializers.IntegerField()
    images = StatsImageSerializer(source='images', many=True)
    weights = StatsWeightSerializer(source='weights', many=True)
