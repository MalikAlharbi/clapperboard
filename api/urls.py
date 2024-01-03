from django.urls import path
from .views import *
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
    path('getImg/<username>/',getImg, name='getImg'),
    path('getUsername', getUsername, name='getUsername'),
    path('getUsernameById/<int:userid>', getUsernameById, name='getUsernameById'),    
    path('getProfileData/<username>/', getProfileData, name='getProfileData'),
    path('getProfileShows/<username>/', getProfileShows, name='getProfileShows'),
    path('getProfileEpisodes/show_id=<int:show_id>/username=<str:username>/', getProfileEpisodes, name='getProfileEpisodes'),
    path('showFriends', showFriends, name='showFriends'),
    path('friendshipStatus/<int:user>', friendshipStatus, name='friendshipStatus'),
    path('sendFriendRequest', sendFriendReq, name='sendFriendReq'),
    path('showFriendReq', showFriendReq, name='showFriendReq'),
    path('friendReqDecision', friendReqDecision, name='friendReqDecision'),
    path('deleteFriend', deleteFriend, name='deleteFriend'),
     path('searchForUser/<str:username>', searchForUser, name='searchForUser'),


]
