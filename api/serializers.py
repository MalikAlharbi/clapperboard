from rest_framework import serializers
from .models import UserShow


class UserShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'user', 'show', 'season', 'watched_episodes', 'modified_at')


class UserShowsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'show')


class UserShowUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('show', 'season', 'watched_episodes','modified_at')
