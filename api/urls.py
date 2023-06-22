from django.urls import include, path
from .views import UserShowView, UserShowUpdate

urlpatterns = [
    path('usershows', UserShowView.as_view()),
    path('saveshow', UserShowUpdate.as_view())
]
