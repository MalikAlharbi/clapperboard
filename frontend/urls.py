from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('activation', index),
    path('browse', index),
    path('myshows', index),
    path('profile/<username>',index),
    path('friends', index),
    path('404',index),
]
