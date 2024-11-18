# currency/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('convert/', views.convert_currency, name='convert-currency'),
    path('currencies/', views.get_available_currencies, name='available-currencies'),
    path('rate/', views.get_exchange_rate, name='exchange-rate'),
]