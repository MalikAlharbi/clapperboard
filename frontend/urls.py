from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('activation', index),
    path('password_reset/<str:uidb64>/<str:token>', index),
    path('browse', index),
    path('myshows', index),
    path('watchlist', index),
    path('profile/<username>', index),
    path('friends', index),
    path('404', index),
]
