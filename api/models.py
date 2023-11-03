from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField


class UserShow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    showId = models.IntegerField()
    showName = models.TextField(default='')
    season = models.IntegerField()
    watched_episodes = models.TextField(default='')
    modified_at = models.DateTimeField(auto_now=True)
    modified_index = models.IntegerField(default=-1)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_img = models.ImageField(upload_to='users/profile_images/%Y/%m/%d',blank=True)