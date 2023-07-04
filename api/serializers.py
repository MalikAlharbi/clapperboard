from rest_framework import serializers
from .models import UserShow


class UserShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'user', 'show', 'season', 'watched_episodes')


class UserShowUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('user', 'show', 'season', 'watched_episodes')
