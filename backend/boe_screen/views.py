from django.db.models import Min, Max
from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser
from .utils import *
from .serializer import *
from rest_framework import status


# 动态分析页
# api/flow
def api_flow(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        img = base2pil(data['image'])

        image_name = data['image_name']
        mask, pred, size, area, weights = get_mask(img, analyze=True)
        img = pil2base(img, 'PNG')
        mask = pil2base(mask, 'PNG')

        texture_name = data['image_name'][:6]
        try:
            texture = Texture.objects.get(texture_name=texture_name)
        except Texture.DoesNotExist:
            texture = Texture.objects.create(texture_name=texture_name, image_size=0)

        data = {
            'image': img,
            'image_name': image_name,
            'mask': mask,
            'pred': pred,
            'texture_id': texture.id,
            'weight1': weights["1"],
            'weight2': weights["2"],
            'size': "{} * {}".format(size[0], size[1]),
            'area': area
        }
        serializer = ApiFlowPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

        data = serializer.data
        data['texture_id'] = texture.id
        data['texture_name'] = texture.texture_name
        data['area'] = int(area)  # type(area) = numpy.int64
        data['ratio'] = int(area * 10000 / (size[0] * size[1]))
        data['weights'] = {"1": data["weight1"], "2": data["weight2"]}
        return JsonResponse(data, status=status.HTTP_200_OK)


# 图片详情页
# api/image/<int:id>
def api_image(request, id):
    if request.method == 'GET':
        try:
            image = Image.objects.get(id=id)
            # weights = image.imageclass_set.all()
        except Image.DoesNotExist:
            return HttpResponse("找不到id为{}的图片".format(id), status=status.HTTP_404_NOT_FOUND)
        else:
            data = {
                'id': image.id,
                'image': image.image,
                'image_name': image.image_name,
                'mask': image.mask,
                'time': image.time,
                'pred': image.pred,
                'size': image.size,
                'area': image.area,
                'texture_id': image.texture.id,
                'texture_name': image.texture.texture_name,
            }
            serializer = ApiImageGetSerializer(data=data)
            if not serializer.is_valid():
                print("GET error", serializer.errors)
                return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)
            else:
                data = serializer.data
                height, width = int(image.size[:image.size.index('*')]), int(image.size[1 + image.size.index('*'):])
                data['ratio'] = int(image.area * 10000 / (height * width))
                data['weights'] = {"1": image.weight1, "2": image.weight2}
                return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        try:
            image = Image.objects.get(id=id)
        except Image.DoesNotExist:
            return HttpResponse("找不到id为{}的图片".format(id), status=status.HTTP_404_NOT_FOUND)
        else:
            data = JSONParser().parse(request)
            new_pred = data['class']
            old_pred = image.pred
            image.pred = new_pred
            image.save()
            # todo: class 3
            texture = image.texture
            if old_pred == 1 and new_pred == 2:
                texture.bad_count -= 1
                texture.dirt_count += 1
            elif old_pred == 2 and new_pred == 1:
                texture.bad_count += 1
                texture.dirt_count -= 1
            texture.save()
            return HttpResponse(status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            img = Image.objects.get(id=id)
        except Image.DoesNotExist:
            return HttpResponse(content="找不到id为{}的图片".format(id), status=status.HTTP_404_NOT_FOUND)
        else:
            texture = img.texture
            texture.image_size -= 1
            if img.pred == 1:
                texture.bad_count -= 1
                texture.sum_bad_size -= img.size
                if texture.min_bad_size == img.area:
                    texture.min_bad_size = texture.image_set.filter(pred=1 & id != img.id).aggregate(Min('area'))
                if texture.max_bad_size == img.area:
                    texture.max_bad_size = texture.image_set.filter(pred=1 & id != img.id).aggregate(Max('area'))
            else:
                texture.dirt_count -= 1
                texture.sum_dirt_size -= img.size
                if texture.min_dirt_size == img.size:
                    texture.min_dirt_size = texture.image_set.filter(pred=2 & id != img.id).aggregate(Min('area'))
                if texture.max_dirt_size == img.size:
                    texture.max_dirt_size = texture.image_set.filter(pred=2 & id != img.id).aggregate(Max('area'))
            img.delete()
            texture.save()
            return HttpResponse(status=status.HTTP_200_OK)


# 纹理总览页
# api/texture/index
def api_texture(request):
    if request.method == 'GET':
        textures = Texture.objects.all()
        data = [{
            "texture_id": t.id,
            "texture_name": t.texture_name,
            "total": t.bad_count + t.dirt_count,
            "bad_count": t.bad_count,
            "bad_ratio": 100 * t.bad_count / (t.bad_count + t.dirt_count) if t.bad_count + t.dirt_count != 0 else 0
        } for t in textures]
        data = {"textures": data}
        serializer = ApiTexturesSerializer(data)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data = {
            "texture_name": data["texture_name"]
        }
        serializer = ApiTexturePostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponse(status=status.HTTP_200_OK)
        else:
            print(serializer.error)
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


# 生产线详情页
# api/texture/<int:id>
def api_textureDetail(request, id):
    try:
        texture = Texture.objects.get(id=id)
    except Texture.DoesNotExist:
        return HttpResponse("找不到id为{}的生产线".format(id), status=status.HTTP_404_NOT_FOUND)
    else:
        if request.method == 'GET':
            data = {
                'texture_id': texture.id,
                'texture_name': texture.texture_name,
                "total": texture.image_size,
                "bad_count": texture.bad_count,
                "bad_ratio": int(10000 * texture.bad_count / texture.image_size) if texture.image_size != 0 else 0,
                "avg_dirt_size": int(
                    100 * texture.sum_dirt_size / texture.image_size) if texture.image_size != 0 else 0,
                "min_dirt_size": texture.min_dirt_size,
                "max_dirt_size": texture.max_dirt_size,
                "avg_bad_size": int(100 * texture.sum_bad_size / texture.image_size) if texture.image_size != 0 else 0,
                "min_bad_size": texture.min_bad_size,
                "max_bad_size": texture.max_bad_size,
                "bad_images": texture.image_set.filter(pred=1),
                "dirt_images": texture.image_set.filter(pred=2)
            }
            serializer = ApiTextureDetailSerializer(data)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)


# 数据统计页
# api/stats
def api_stats(request):
    if request.method == 'GET':
        # data = JSONParser().parse(request)
        # start_time = data['start_time']
        # end_time = data['end_time']

        """
        images = texture.image_set.filter(time__gte=start_time, time__lte=end_time)
        data = {
            'texture_name': texture.texture_name,
            'image_size': texture.image_size,
            'images': images,
            'weights': texture.textureclass_set.all()
        }
        serializer = ApiStatsSerializer(data=data)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        """
        textures = Texture.objects.all()
        data = {
            "textures": textures.values_list("texture_name", flat=True),
            "bad": textures.values_list("bad_count", flat=True),
            "dirt": textures.values_list("dirt_count", flat=True)
        }
        serializer = ApiStatsSerializer(data)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)


# 帮助页
# api/help
def api_help(request):
    return HttpResponse("call lzhmark for help")
