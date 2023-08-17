from django.urls import include, path
from .views import AllUsers, UserShowUpdate, UserShows, UserEpisodes, signIn, signUp, is_authenticated, signOut

urlpatterns = [
    path('allusers', AllUsers.as_view()),
    path('user-shows/', UserShows.as_view()),
    path('user-episodes/', UserEpisodes.as_view()),
    path('saveshow', UserShowUpdate.as_view()),
    path('signin', signIn, name='signin'),
    path('signup', signUp, name='signup'),
    path('is-authenticated', is_authenticated, name='is_authenticated'),
    path('signout', signOut, name='signout'),
]
