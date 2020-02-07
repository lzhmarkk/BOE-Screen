from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser
from .utils import *


# Create your views here.
def api_index(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        image = data['image']
        mask = get_mask(image)
        return JsonResponse({'mask': mask})


def api_repo(request):
    pass


def api_stats(request):
    pass
