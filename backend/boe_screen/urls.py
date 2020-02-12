from django.urls import path
from . import views

urlpatterns = [
    path('api/flow/', views.api_flow, name='flow'),
    path('api/image/<int:id>', views.api_image, name='image'),
    path('api/prodLine/<int:id>', views.api_prodLine, name='prodLine'),
    path('api/stats/', views.api_stats, name='stats'),
    path('api/help/', views.api_help, name='help'),
]
