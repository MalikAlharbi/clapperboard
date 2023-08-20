import json
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserShowSerializer, UserShowsSerializer, UserShowUpdateSerializer
from .models import UserShow


class AllUsers(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = UserShow.objects.all()

    serializer_class = UserShowSerializer


class UserShows(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowsSerializer

    def get_queryset(self):
        user_id = self.request.user
        # queryset = UserShow.objects.filter(user=user_id).order_by('show')
        # unique_shows = [next(group)
        #                 for key, group in groupby(queryset, lambda x: x.show)]

        queryset = UserShow.objects.filter(
            user=user_id).values('show').distinct()
        return queryset


class UserEpisodes(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowSerializer

    def get_queryset(self):
        user_id = self.request.user
        show = self.request.GET.get('show')
        show_id = int(show.strip().rstrip('/'))
        queryset = UserShow.objects.filter(user=user_id, show=show_id)
        queryset = queryset.order_by('season')
        return queryset


class UserShowUpdate(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowUpdateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            user_id = self.request.user
            show = int(serializer.validated_data.get('show'))
            season = int(serializer.validated_data.get('season'))
            watched_episodes = serializer.validated_data.get(
                'watched_episodes')
            watched_episodes_list = watched_episodes.split(",")

            queryset = UserShow.objects.filter(
                user=user_id, show=show, season=season)
            # if show is already in the database then update else create a new row
            if queryset.exists():
                # when user unclick a season delete it from db
                if all(boolean == 'false' for boolean in watched_episodes_list):
                    queryset.delete()
                    return Response("RECORD DELETED", status=status.HTTP_200_OK)

                else:
                    newData = queryset.first()
                    newData.watched_episodes = watched_episodes
                    newData.save(update_fields=['watched_episodes'])
                    return Response(UserShowSerializer(newData).data, status=status.HTTP_200_OK)
            elif not all(boolean == 'false' for boolean in watched_episodes_list):
                newData = UserShow(user=user_id,
                                   show=show, season=season, watched_episodes=watched_episodes)
                newData.save()
                return Response(UserShowSerializer(newData).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@ensure_csrf_cookie
def signIn(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True})

        return JsonResponse({'success': False})

@ensure_csrf_cookie
def signUp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        email = data["email"]
        invalid_username = User.objects.filter(username=username).exists()
        invalid_email = User.objects.filter(email=email).exists()

        if not (username and password and email):
            return JsonResponse({'success': False, 'error': 'Missing parameters'})

        if (invalid_username and invalid_email):
            return JsonResponse({"success": False, 'error': 'Username and email already exists'})

        if invalid_username:
            return JsonResponse({"success": False, 'error': 'Username already exists'})

        if invalid_email:
            return JsonResponse({"success": False, 'error': 'Email already exists'})

        user = User.objects.create_user(
            username=username, email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True})

        return JsonResponse({'success': False})

@ensure_csrf_cookie
def is_authenticated(request):
    if (request.user.is_authenticated):
        return JsonResponse({"success": True})

    return JsonResponse({"success": False})

@ensure_csrf_cookie
def signOut(request):
    permission_classes = [IsAuthenticated]
    if (request.user.is_authenticated):
        logout(request)
        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "error": "error occured"})
