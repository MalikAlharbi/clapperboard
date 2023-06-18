from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics
from .serializers import UserShowSerializer
from .models import UserShow
# Create your views here.


class UserShowView(generics.ListAPIView):
    queryset = UserShow.objects.all()
    serializer_class = UserShowSerializer
