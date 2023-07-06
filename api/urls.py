from django.urls import include, path
from .views import AllUsers, UserShowUpdate, UserShows, UserEpisodes

urlpatterns = [
    path('allusers', AllUsers.as_view()),
    path('user-shows/', UserShows.as_view()),
    path('user-episodes/', UserEpisodes.as_view()),
    path('saveshow', UserShowUpdate.as_view()),
]
