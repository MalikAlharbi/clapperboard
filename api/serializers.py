from rest_framework import serializers
from .models import UserShow,  FriendRequest, Friendship


class UserShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'user', 'showId','showName', 'season', 'watched_episodes', 'modified_at','modified_index')


class UserShowsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('id', 'showId','showName')


class UserShowUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserShow
        fields = ('showId', 'showName', 'season', 'watched_episodes','modified_at','modified_index')

class TopShowsSerializer(serializers.ModelSerializer):
    showId = serializers.IntegerField()
    showCount = serializers.IntegerField()
    class Meta:
        model = UserShow
        fields = ('showId','showCount')
        

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['user_1', 'user_2']


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['from_user', 'to_user']

