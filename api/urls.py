from django.urls import include, path
from .views import AllUsers, UserShowUpdate, UserShows, TopShows , UserEpisodes, LatestWatchedEpisodes, signIn, signUp, is_authenticated, signOut, upload_image, getImg, getUsername
urlpatterns = [
    path('allusers', AllUsers.as_view()),
    path('user-shows/',UserShows.as_view()),
    path('user-episodes/', UserEpisodes.as_view()),
    path('top-shows', TopShows.as_view()),
    path('saveshow', UserShowUpdate.as_view()),
    path('latest-episodes', LatestWatchedEpisodes.as_view()),
    path('signin', signIn, name='signin'),
    path('signup', signUp, name='signup'),
    path('is-authenticated', is_authenticated, name='is_authenticated'),
    path('signout', signOut, name='signout'),
    path('upload',upload_image,name='upload'),
    path('getImg',getImg, name='getImg'),
    path('getUsername', getUsername, name='getUsername')
    
]
