from django.db import models
from django.contrib.auth.models import User


class UserShow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show = models.IntegerField()
    watched_episodes = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.show.name}"
