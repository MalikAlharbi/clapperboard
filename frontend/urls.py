from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('activation', index),
    path('browse', index),
    path('myshows', index),
    path('profile/<username>',index),
    path('friends', index),
    path('404',index),
    re_path(r'^.*$', index, name='404'),
]
