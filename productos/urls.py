from django.urls import path
from . import views

urlpatterns = [
    path('api/producto/', views.lista_productos, name='lista_productos'),
]