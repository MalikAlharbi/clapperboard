from django.urls import include, path
from .views import UserShowView

urlpatterns = [
    path('', UserShowView.as_view())
]
