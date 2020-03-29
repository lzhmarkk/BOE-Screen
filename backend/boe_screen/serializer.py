from rest_framework import serializers
from _datetime import datetime
from .models import *


class ProdLineImageSerializer(serializers.Serializer):
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
    prodline_id = serializers.PrimaryKeyRelatedField(source='prod_line', queryset=ProdLine.objects.all())

    class Meta:
        model = Image
        fields = ['image_name', 'image', 'time', 'mask', 'pred', 'size', 'area', 'prodline_id', 'weight1', 'weight2']

    def create(self, validated_data):
        validated_data['time'] = datetime.now()
        # create image
        img = Image.objects.create(**validated_data)

        weights = validated_data.get('weights')
        prodline = validated_data.get('prod_line')
        prodline.image_size += 1
        if validated_data.get('pred') == "1":
            prodline.count1 += 1
        else:
            prodline.count2 += 1
        prodline.save()
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

    prodline_id = serializers.IntegerField()
    prodline_name = serializers.CharField()
    """
    class Meta:
        model = Image
        fields = ['id', 'image_name', 'image', 'time', 'mask', 'pred', 'size',
                  'area', 'weight1', 'weight2', 'prodline_id', 'prodline_name']
    """


class ApiProdLineDetailSerializer(serializers.Serializer):
    """
    根据ProdLine构造json
    """
    prodline_id = serializers.IntegerField()
    prodline_name = serializers.CharField()
    total = serializers.IntegerField()
    bad_count = serializers.IntegerField()
    bad_ratio = serializers.IntegerField()
    avg_dirt_size = serializers.IntegerField()
    min_dirt_size = serializers.IntegerField()
    max_dirt_size = serializers.IntegerField()
    avg_bad_size = serializers.IntegerField()
    min_bad_size = serializers.IntegerField()
    max_bad_size = serializers.IntegerField()
    dirt_images = ProdLineImageSerializer(many=True)
    bad_images = ProdLineImageSerializer(many=True)


class ProdLineSerializer(serializers.Serializer):
    prodline_id = serializers.IntegerField()
    prodline_name = serializers.CharField()
    total = serializers.IntegerField()
    bad_count = serializers.IntegerField()
    bad_ratio = serializers.DecimalField(decimal_places=2, max_digits=4)


class ApiProdLinesSerializer(serializers.Serializer):
    prodlines = ProdLineSerializer(many=True)


class ApiProdLinePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdLine
        fields = ['id', 'prod_line_name', 'image_size', 'count1', 'count2']

    def create(self, **validated_data):
        ProdLine.objects.create(**validated_data)


class ApiStatsSerializer(serializers.Serializer):
    """
    根据ProdLine的images统计
    """
    prod_line_name = serializers.CharField()
    image_size = serializers.IntegerField()
    images = StatsImageSerializer(source='images', many=True)
