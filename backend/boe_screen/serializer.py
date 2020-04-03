from rest_framework import serializers
from _datetime import datetime
from .models import *


class TextureImageSerializer(serializers.Serializer):
    image_id = serializers.IntegerField(source='id')
    image_name = serializers.CharField()
    time = serializers.DateTimeField()
    pred = serializers.IntegerField()
    size = serializers.CharField()
    area = serializers.IntegerField()
    # ratio = serializers.IntegerField()


class StatsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image_name', 'image', 'time', 'mask', 'pred']


class ApiFlowPostSerializer(serializers.ModelSerializer):
    """
    根据Image构造json
    """
    texture_id = serializers.PrimaryKeyRelatedField(source='texture', queryset=Texture.objects.all())

    class Meta:
        model = Image
        fields = ['image_name', 'image', 'time', 'mask', 'pred', 'size', 'area', 'texture_id', 'weight1', 'weight2']

    def create(self, validated_data):
        validated_data['time'] = datetime.now()
        # create image
        img = Image.objects.create(**validated_data)

        weights = validated_data.get('weights')
        texture = validated_data.get('texture')
        texture.image_size += 1
        if validated_data.get('pred') == 1:
            texture.bad_count += 1
            texture.sum_bad_size += validated_data['area']
            texture.min_bad_size = min(texture.min_bad_size, validated_data['area'])
            texture.max_bad_size = max(texture.max_bad_size, validated_data['area'])
        else:
            texture.dirt_count += 1
            texture.sum_dirt_size += validated_data['area']
            texture.min_dirt_size = min(texture.min_bad_size, validated_data['area'])
            texture.max_dirt_size = max(texture.max_bad_size, validated_data['area'])
        texture.save()
        """
        if weights is not None:
            for _, _class in enumerate(weights):
                value = weights[_class]
                # create prediction
                ImageClass.objects.create(name=_class, value=value, image=img)
                # update production line
                try:
                    prod_line_class = prodline.prodlineclass_set.get(name=_class)
                    prod_line_class.value += 1
                    prod_line_class.save()
                except ProdLineClass.DoesNotExist:
                    ProdLineClass.objects.create(name=_class, value=1, prod_line=prodline)
        """
        return img


class ApiImageGetSerializer(serializers.Serializer):
    """
    根据Image构造json
    """

    id = serializers.IntegerField()
    image_name = serializers.CharField()
    image = serializers.CharField()
    time = serializers.DateTimeField()
    mask = serializers.CharField()
    pred = serializers.IntegerField()
    size = serializers.CharField()
    area = serializers.IntegerField()

    texture_id = serializers.IntegerField()
    texture_name = serializers.CharField()
    """
    class Meta:
        model = Image
        fields = ['id', 'image_name', 'image', 'time', 'mask', 'pred', 'size',
                  'area', 'weight1', 'weight2', 'prodline_id', 'prodline_name']
    """


class ApiTextureDetailSerializer(serializers.Serializer):
    """
    根据ProdLine构造json
    """
    texture_id = serializers.IntegerField()
    texture_name = serializers.CharField()
    total = serializers.IntegerField()
    bad_count = serializers.IntegerField()
    bad_ratio = serializers.IntegerField()
    avg_dirt_size = serializers.IntegerField()
    min_dirt_size = serializers.IntegerField()
    max_dirt_size = serializers.IntegerField()
    avg_bad_size = serializers.IntegerField()
    min_bad_size = serializers.IntegerField()
    max_bad_size = serializers.IntegerField()
    dirt_images = TextureImageSerializer(many=True)
    bad_images = TextureImageSerializer(many=True)


class TextureSerializer(serializers.Serializer):
    texture_id = serializers.IntegerField()
    texture_name = serializers.CharField()
    total = serializers.IntegerField()
    bad_count = serializers.IntegerField()
    bad_ratio = serializers.IntegerField()


class ApiTexturesSerializer(serializers.Serializer):
    textures = TextureSerializer(many=True)


class ApiTexturePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Texture
        fields = ['id', 'texture_name', 'image_size', 'bad_count', 'dirt_count']

    def create(self, **validated_data):
        Texture.objects.create(**validated_data)


class ApiStatsSerializer(serializers.Serializer):
    """
    根据ProdLine的images统计
    """
    texture_name = serializers.CharField()
    image_size = serializers.IntegerField()
    images = StatsImageSerializer(source='images', many=True)
