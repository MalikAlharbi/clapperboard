from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(UserShow)
admin.site.register(Profile)
admin.site.register(Friendship)
admin.site.register(FriendRequest)