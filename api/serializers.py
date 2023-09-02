from rest_framework import serializers
from .models import UserShow


class UserShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'user', 'showId','showName', 'season', 'watched_episodes', 'modified_at')


class UserShowsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'showId','showName')


class UserShowUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('showId', 'showName', 'season', 'watched_episodes','modified_at')
