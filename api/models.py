from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField


class UserShow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show = models.IntegerField()
    watched_episodes = models.TextField(default='')
    # watched_episodes = models.IntegerField()
   # watched_episodes = JSONField(default=dict)
