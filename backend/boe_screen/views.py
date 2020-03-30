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

        prodline_name = data['prodline_name']
        try:
            prodline = ProdLine.objects.get(prod_line_name=prodline_name)
        except ProdLine.DoesNotExist:
            prodline = ProdLine.objects.create(prod_line_name=prodline_name, image_size=0)

        data = {
            'image': img,
            'image_name': image_name,
            'mask': mask,
            'pred': pred,
            'prodline_id': prodline.id,
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
        data['prodline_name'] = prodline.prod_line_name
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
                'prodline_id': image.prod_line.id,
                'prodline_name': image.prod_line.prod_line_name,
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
            prodline = image.prod_line
            if old_pred == 1 and new_pred == 2:
                prodline.count1 -= 1
                prodline.count2 += 1
            elif old_pred == 2 and new_pred == 1:
                prodline.count1 += 1
                prodline.count2 -= 1
            prodline.save()
            return HttpResponse(status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            img = Image.objects.get(id=id)
        except Image.DoesNotExist:
            return HttpResponse(content="找不到id为{}的图片".format(id), status=status.HTTP_404_NOT_FOUND)
        else:
            prodline = img.prod_line
            # prodline_class = prodline.prodlineclass_set.get(name=img.pred)
            prodline.image_size -= 1
            if img.pred == 1:
                prodline.count1 -= 1
                prodline.sum_bad_size -= img.size
                if prodline.min_bad_size == img.area:
                    prodline.min_bad_size = prodline.image_set.filter(pred=1 & id != img.id).aggregate(Min('area'))
                if prodline.max_bad_size == img.area:
                    prodline.max_bad_size = prodline.image_set.filter(pred=1 & id != img.id).aggregate(Max('area'))
            else:
                prodline.count2 -= 1
                prodline.sum_dirt_size -= img.size
                if prodline.min_dirt_size == img.size:
                    prodline.min_dirt_size = prodline.image_set.filter(pred=2 & id != img.id).aggregate(Min('area'))
                if prodline.max_dirt_size == img.size:
                    prodline.max_dirt_size = prodline.image_set.filter(pred=2 & id != img.id).aggregate(Max('area'))
            img.delete()
            prodline.save()
            return HttpResponse(status=status.HTTP_200_OK)


# 生产线总览页
# api/prodLine/index
def api_prodLine(request):
    if request.method == 'GET':
        prodlines = ProdLine.objects.all()
        data = [{
            "prodline_id": p.id,
            "prodline_name": p.prod_line_name,
            "total": p.count1 + p.count2,
            "bad_count": p.count1,
            "bad_ratio": 100 * p.count1 / (p.count1 + p.count2)
        } for p in prodlines]
        data = {"prodlines": data}
        print(data["prodlines"])
        serializer = ApiProdLinesSerializer(data)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data = {
            "prod_line_name": data["prodline_name"]
        }
        serializer = ApiProdLinePostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponse(status=status.HTTP_200_OK)
        else:
            print(serializer.error)
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


# 生产线详情页
# api/prodLine/<int:id>
def api_prodLineDetail(request, id):
    try:
        prod_line = ProdLine.objects.get(id=id)
    except ProdLine.DoesNotExist:
        return HttpResponse("找不到id为{}的生产线".format(id), status=status.HTTP_404_NOT_FOUND)
    else:
        if request.method == 'GET':
            data = {
                'prodline_id': prod_line.id,
                'prodline_name': prod_line.prod_line_name,
                "total": prod_line.image_size,
                "bad_count": prod_line.count1,
                "bad_ratio": int(10000 * prod_line.count1 / prod_line.image_size),
                "avg_dirt_size": int(100 * prod_line.sum_dirt_size / prod_line.image_size),
                "min_dirt_size": prod_line.min_dirt_size,
                "max_dirt_size": prod_line.max_dirt_size,
                "avg_bad_size": int(100 * prod_line.sum_bad_size / prod_line.image_size),
                "min_bad_size": prod_line.min_bad_size,
                "max_bad_size": prod_line.max_bad_size,
                "dirt_images": prod_line.image_set.filter(pred=2),
                "bad_images": prod_line.image_set.filter(pred=1)
            }
            serializer = ApiProdLineDetailSerializer(data)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)


# 数据统计页
# api/stats
def api_stats(request):
    if request.method == 'GET':
        data = JSONParser().parse(request)
        start_time = data['start_time']
        end_time = data['end_time']
        prod_line_id = data['prod_line']

        try:
            prod_line = ProdLine.objects.get(id=prod_line_id)
        except ProdLine.DoesNotExist:
            return HttpResponse("找不到id为{}的生产线".format(id), status=status.HTTP_404_NOT_FOUND)
        else:
            images = prod_line.image_set.filter(time__gte=start_time, time__lte=end_time)
            data = {
                'prod_line_name': prod_line.prod_line_name,
                'image_size': prod_line.image_size,
                'images': images,
                'weights': prod_line.prodlineclass_set.all()
            }
            serializer = ApiStatsSerializer(data=data)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)


# 帮助页
# api/help
def api_help(request):
    return HttpResponse("call lzhmark for help")
