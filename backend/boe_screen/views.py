from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser
from .utils import *
from .serializer import *
from rest_framework import status
from PIL import Image


# 动态分析页
# api/flow
def api_flow(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        img = base2pil(data['image'])

        image_name = data['image_name']
        mask, pred, weights, area = get_mask(img, analyze=True)
        mask = Image.fromarray(mask.astype('uint8')).resize(img.size)

        prodline_name = data['prodline_name']
        """try:
            prodline = ProdLine.objects.get(prod_line_name=prodline_name)
        except ProdLine.DoesNotExist:
            prodline = ProdLine.objects.create(prod_line_name=prodline_name, image_size=0)
        """
        data = {
            'image': img,
            'image_name': image_name,
            'mask': mask,
            'pred': pred,
            # 'prodline': prodline
        }
        serializer = ApiFlowPostSerializer(data=data)
        if serializer.is_valid():
            # serializer.save()
            pass

        data = serializer.data
        data['image'] = pil2base(img, 'PNG')
        data['mask'] = pil2base(mask, 'PNG')
        data['class'] = "True Bad" if data['pred'] == 1 else "False Bad"
        data['pred'] = "pred"
        return JsonResponse(data, status=status.HTTP_200_OK)


# 图片详情页
# api/image/<int:id>
def api_image(request, id):
    if request.method == 'GET':
        try:
            image = Image.objects.get(id=id)
            weights = image.imageclass_set.all()
        except Image.DoesNotExist:
            return HttpResponse("找不到id为{}的图片".format(id), status=status.HTTP_400_BAD_REQUEST)
        else:
            data = {
                'image': image,
                'weights': weights
            }
            serializer = ApiImageGetSerializer(data=data)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            img = Image.objects.get(id=id)
            prodline = img.prod_line
            prodline_class = prodline.prodlineclass_set.get(name=img.pred)
            prodline.image_size -= 1
            prodline.save()
            prodline_class.value -= 1
            prodline_class.save()
            img.delete()
        except Image.DoesNotExist:
            return HttpResponse(content="找不到id为{}的图片".format(id), status=status.HTTP_400_BAD_REQUEST)
        else:
            return HttpResponse(status=status.HTTP_200_OK)


# 生产线详情页
# api/prodLine/<int:id>
def api_prodLine(request, id):
    try:
        prod_line = ProdLine.objects.get(id=id)
    except ProdLine.DoesNotExist:
        return HttpResponse("找不到id为{}的生产线".format(id), status=status.HTTP_400_BAD_REQUEST)
    else:
        if request.method == 'GET':
            data = {
                'prod_line_id': prod_line.id,
                'prod_line_name': prod_line.prod_line_name,
                'image_size': prod_line.image_size,
                'images': prod_line.image_set.all(),
                'weights': prod_line.prodlineclass_set.all()
            }
            serializer = ApiProdLineSerializer(data=data)
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
            return HttpResponse("找不到id为{}的生产线".format(id), status=status.HTTP_400_BAD_REQUEST)
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
