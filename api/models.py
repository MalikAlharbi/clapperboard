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