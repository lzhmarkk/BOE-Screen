from django.urls import path
from . import views

urlpatterns = [
    path('api/flow/', views.api_flow, name='flow'),
    path('api/image/<int:id>', views.api_image, name='image'),
    path('api/texture/index', views.api_texture, name='texture'),
    path('api/texture/<int:id>', views.api_textureDetail, name='textureDetail'),
    path('api/stats/<int:page>', views.api_stats, name='stats'),
    path('api/help/', views.api_help, name='help'),
]
