from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.contrib.postgres.fields import JSONField


class UserShow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    showId = models.IntegerField()
    showName = models.TextField(default='')
    season = models.IntegerField()
    apiSeason = models.IntegerField(default=-1)
    watched_episodes = models.TextField(default='')
    modified_at = models.DateTimeField(auto_now=True)
    modified_index = models.IntegerField(default=-1)
    favorite = models.BooleanField(default=False)
    watch_list = models.BooleanField(default=False)


class ShowsList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    showId = models.IntegerField(unique=True)
    favorite = models.BooleanField(default=False)
    watch_list = models.BooleanField(default=False)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_img = models.ImageField(
        upload_to='users/profile_images/%Y/%m/%d', blank=True)


class Friendship(models.Model):
    created = models.DateTimeField(auto_now_add=True, editable=False)
    user_1 = models.ForeignKey(
        User, related_name="user_1_friendship", on_delete=models.CASCADE, default='')
    user_2 = models.ForeignKey(
        User, related_name="user_2_friendship", on_delete=models.CASCADE, default='')

    class Meta:
        unique_together = ('user_1', 'user_2')


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        User, related_name="Request_from_user", on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        User, related_name="Request_to_user", on_delete=models.CASCADE)

    class Meta:
        unique_together = ('from_user', 'to_user')
