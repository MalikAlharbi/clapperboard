from django.urls import include, path
from .views import index

urlpatterns = [
    path('', index),
    path('browse', index),
    path('myshows', index),
]
