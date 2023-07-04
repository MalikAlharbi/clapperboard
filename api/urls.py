from django.urls import include, path
from .views import UserShowView, UserShowUpdate, UserWathcedEpisodes

urlpatterns = [
    path('usershows', UserShowView.as_view()),
    path('user-watched-episodes/', UserWathcedEpisodes.as_view()),
    path('saveshow', UserShowUpdate.as_view()),
]