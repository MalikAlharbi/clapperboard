from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserShowSerializer, UserShowUpdateSerializer
from .models import UserShow


class UserShowView(generics.ListAPIView):
    queryset = UserShow.objects.all()
    serializer_class = UserShowSerializer


class UserShowUpdate(APIView):
    serializer_class = UserShowUpdateSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            user_id = serializer.validated_data.get('user')
           # user = User.objects.get(id=user_id)
            watched_episodes = serializer.validated_data.get(
                'watched_episodes')
            show = int(serializer.validated_data.get('show'))
            queryset = UserShow.objects.filter(
                Q(show=show) & Q(user=user_id))
            # if show is already in the database then update else create a new row
            if queryset.exists():
                newData = queryset.first()
                newData.watched_episodes = watched_episodes
                newData.save(update_fields=['watched_episodes'])
                return Response(UserShowSerializer(newData).data, status=status.HTTP_200_OK)
            else:
                newData = UserShow(user=user_id,
                                   show=show, watched_episodes=watched_episodes)
                newData.save()
                return Response(UserShowSerializer(newData).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
