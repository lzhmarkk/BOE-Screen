from django.urls import path
from . import views

urlpatterns = [
    path('api/index/', views.api_index, name='index'),
    path('api/repo/', views.api_repo, name='repo'),
    path('api/stats/', views.api_stats, name='stats')
]
