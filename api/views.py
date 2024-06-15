import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import CommonPasswordValidator
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sessions.models import Session
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.db.models import Max, Subquery, OuterRef, Count
from django.db.models.functions import Length
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Profile, ShowsList
from .serializers import *

# Authentication and User-related functions
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.http import JsonResponse

# User registration and email verification
from .models import User, Profile
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from django.http import JsonResponse


def custom_404(request, exception):
    return redirect("/404")


class AllUsers(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = UserShow.objects.all()

    serializer_class = UserShowSerializer


class UserShows(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowsSerializer

    def get_queryset(self):
        user_id = self.request.user
        queryset = UserShow.objects.filter(
            user=user_id).values('showId').distinct().order_by('-modified_at')
        return queryset


class UserEpisodes(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowSerializer

    def get_queryset(self):
        user_id = self.request.user
        show = self.request.GET.get('show')
        show_id = int(show.strip().rstrip('/'))
        queryset = UserShow.objects.filter(user=user_id, showId=show_id)
        queryset = queryset.order_by('season')
        return queryset


class LatestWatchedEpisodes(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowSerializer

    def get_queryset(self):
        latest_modifications = UserShow.objects.filter(
            user=self.request.user,
            showId=OuterRef('showId')
        ).order_by('showId').values('showId').annotate(
            latest_modified_at=Max('modified_at')
        ).values('latest_modified_at')

        userShows = UserShow.objects.filter(
            user=self.request.user,
            modified_at__in=Subquery(latest_modifications)
        ).order_by('-modified_at')[:3]

        return userShows


class TopShows(generics.ListAPIView):
    permission_classes = []
    serializer_class = TopShowsSerializer

    def get_queryset(self):
        return UserShow.objects.values('showId').annotate(showCount=Count('user', distinct=True)).order_by('-showCount')[:3]


class UserShowUpdate(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowUpdateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            user_id = self.request.user
            showId = int(serializer.validated_data.get('showId'))
            showName = serializer.validated_data.get('showName')
            season = int(serializer.validated_data.get('season'))
            apiSeason = int(serializer.validated_data.get('apiSeason'))
            modified_index = serializer.validated_data.get('modified_index')
            watched_episodes = serializer.validated_data.get(
                'watched_episodes')
            watched_episodes_list = watched_episodes.split(",")

            queryset = UserShow.objects.filter(
                user=user_id, showId=showId, season=season)
            userShowsQuery = UserShow.objects.filter(
                user=user_id, showId=showId).exists()
            if not userShowsQuery:
                showsListQuery = ShowsList.objects.filter(
                    user=user_id, showId=showId)
                if showsListQuery.exists():
                    showsListQuery = showsListQuery.first()
                    showsListQuery.watch_list = False
                    showsListQuery.save()
                else:
                    newRecord = ShowsList.objects.create(
                        user=user_id, showId=showId, favorite=False, watch_list=False)
                    newRecord.save()

            # if show is already in the database then update else create a new row
            if queryset.exists():
                # when user unclick a season delete it from db
                if all(boolean == 'false' for boolean in watched_episodes_list):
                    queryset.delete()
                    userShowsQuery = UserShow.objects.filter(
                        user=user_id, showId=showId).exists()
                    if not userShowsQuery:
                        newRecord = ShowsList.objects.filter(
                            user=user_id, showId=showId, favorite=False, watch_list=False).delete()
                    return Response("RECORD DELETED", status=status.HTTP_200_OK)

                else:
                    newData = queryset.first()
                    newData.watched_episodes = watched_episodes
                    newData.modified_at = timezone.now()
                    newData.modified_index = modified_index
                    newData.save(update_fields=[
                                 'watched_episodes', 'modified_at', 'modified_index'])

                    return Response(UserShowSerializer(newData).data, status=status.HTTP_200_OK)
            elif not all(boolean == 'false' for boolean in watched_episodes_list):
                newData = UserShow(user=user_id,
                                   showId=showId, showName=showName, season=season, apiSeason=apiSeason, watched_episodes=watched_episodes, modified_index=modified_index)
                newData.modified_at = timezone.now()
                newData.save()
                return Response(UserShowSerializer(newData).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
def signIn(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data["username"]
            password = data["password"]
            rememberMe = data["rememberMe"]
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                if not rememberMe:
                    request.session.set_expiry(0)
                return JsonResponse({'success': True})

            user_object = User.objects.get(username=username)
            if user_object.is_active == False:
                return JsonResponse({'success': False, 'message': 'Please activate your account to continue.'})

            return JsonResponse({'success': False, 'message': 'Invalid password'})

        except KeyError:
            return JsonResponse({'success': False, 'message': 'Missing required fields'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User does not exist'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request'})


def send_activation_email(request, user):
    try:
        current_site = get_current_site(request)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_url = reverse('verify_email', kwargs={
                                 'uidb64': uidb64, 'token': token})
        activation_url = f'{request.scheme}://{current_site.domain}{activation_url}'

        email_subject = 'Activate your account!'
        email_body = f'Hi {user.username},\n\nPlease click the following link to activate your account:\n\n{activation_url}'
        send_mail(email_subject, email_body,
                  settings.EMAIL_HOST_USER, [user.email])
        return JsonResponse({"success": True, 'message': 'Activation email sent.'})
    except Exception as e:
        return JsonResponse({"success": False, 'message': e})


def send_password_email(request):
    try:
        data = json.loads(request.body)
        user = User.objects.get(email=data['userEmail'])
        current_site = get_current_site(request)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        password_url = reverse('verify_password', kwargs={
                               'uidb64': uidb64, 'token': token})
        password_url = f'{request.scheme}://{current_site.domain}{password_url}'

        email_subject = 'Password reset'
        email_body = f'Hi {user.username},\n\nPlease click the following link to reset your password:\n\n{password_url}'
        send_mail(email_subject, email_body,
                  settings.EMAIL_HOST_USER, [user.email])
        return JsonResponse({"success": True, 'message': 'Password reset email sent.'})
    except User.DoesNotExist:
        return JsonResponse({"success": False, 'message': "Invalid email"})


def verify_password(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        return redirect(f"/password_reset/{uidb64}/{token}", status=200)
    return redirect("/404", status=404)


def verify_link(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        return JsonResponse({"success": True})

    return JsonResponse({"success": False})


def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            uidb64 = data['uidb64']
            token = data['token']
            password = data['password']
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            passwordCheck = checkPassword(password)
            if passwordCheck is True:
                user.password = make_password(password)
                user.save()
                default_token_generator.make_token(user)  # Make url invalid
                return JsonResponse({"success": True, 'message': "Your password have been changed."})
            else:
                return JsonResponse({"success": False, 'error': passwordCheck})

    return redirect("/404", status=404)


def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        # redirect to activation success page
        return redirect("/activation", status=200)
    # redirect to 404 page
    return redirect("/404", status=404)


def checkPassword(password):
    # Password checking
    min_length = 7
    validator = CommonPasswordValidator()
    try:
        validator.validate(password=password)
    except ValidationError as validation_error:
        return validation_error.message

    if len(password) < min_length:
        return 'Password length must be at least 7'

    # Check for digit
    if not any(char.isdigit() for char in password):
        return 'Password must contain at least one digit'

    # Check for letter
    if not any(char.isalpha() for char in password):
        return 'Password must contain at least one letter'

    return True


@ensure_csrf_cookie
def signUp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]

        email = data["email"]
        username_exists = User.objects.filter(username=username).exists()
        email_exists = User.objects.filter(email=email).exists()

        if not (username and password and email):
            return JsonResponse({'success': False, 'error': 'Missing parameters'})

        if (username_exists and email_exists):
            return JsonResponse({"success": False, 'error': 'Username and email already exist'})

        if username_exists:
            return JsonResponse({"success": False, 'error': 'Username already exists'})

        if email_exists:
            return JsonResponse({"success": False, 'error': 'Email already exists'})

        try:
            validate_email(email)
        except ValidationError as validation_error:
            return JsonResponse({'success': False, 'error': validation_error.message})
        passwordCheck = checkPassword(password)
        if passwordCheck is True:
            user = User.objects.create_user(
                username=username, email=email, password=password)

            if user is not None:
                user.is_active = False
                user.save()
                send_activation_email(request, user)
                return JsonResponse({'success': True, 'verification_url': 'verification_url have been sent'})
        else:
            return JsonResponse({"success": False, 'error': passwordCheck})

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


def upload_image(request):
    permission_classes = [IsAuthenticated]
    if request.method == 'POST' and request.FILES.get('file'):
        user_id = request.user
        user_profile = Profile.objects.filter(user=user_id).first()

        if user_profile is None:
            # Create a new Profile object for the user if it doesn't exist
            user_profile = Profile.objects.create(user=user_id)

        image_file = request.FILES['file']
        user_profile.profile_img = image_file
        user_profile.save()

        return JsonResponse({"success": True})

    else:
        return JsonResponse({"success": False, "error": "An error occurred"})


def getImg(request, username):
    try:
        user = User.objects.get(username=username)
        try:
            user_profile = Profile.objects.get(user=user)
            if user_profile.profile_img:
                return JsonResponse({"success": True, "url": user_profile.profile_img.url})
            else:
                return JsonResponse({"success": False, "error": "No image found for the user."})
        except Profile.DoesNotExist:
            return JsonResponse({"success": False, "error": "Profile does not exist for the user."})
    except User.DoesNotExist:
        return JsonResponse({"success": False, "error": "User does not exist."})


@api_view(['GET'])
def getUsername(request):
    return JsonResponse({"success": True, "username": request.user.username})


@api_view(['GET'])
def getUsernameById(request, userid):
    user = User.objects.get(id=userid)
    return JsonResponse({"success": True, "username": user.username})


@api_view(['GET'])
def getProfileData(request, username):
    try:
        user = User.objects.get(username=username)
        date_joined = user.date_joined.strftime("%B %d, %Y")
        total_shows = UserShow.objects.filter(
            user=user).values('showId').distinct().count()

        # Check if the user has an active session
        online = False
        sessions = Session.objects.filter(expire_date__gte=timezone.now())
        for session in sessions:
            session_data = session.get_decoded()
            if str(user.pk) in session_data.get('_auth_user_id', ''):
                online = True
                break

        current_status = 'Online' if online else user.last_login.strftime(
            "%T - %B %d, %Y") if (user.last_login and online is False) else ''

        return JsonResponse({
            "success": True,
            "date_joined": date_joined,
            "total_shows": total_shows,
            "current_status": current_status
        })
    except User.DoesNotExist:
        return JsonResponse({"success": False, "error": "User not found"})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)})


@api_view(['GET'])
def getProfileShows(request, username):
    user = User.objects.get(username=username)
    showsJson = list(UserShow.objects.filter(
        user=user).values('showId').distinct())
    return JsonResponse({"success": True, "showsJson": showsJson})


@api_view(['GET'])
def getProfileEpisodes(request, show_id, username):
    user = User.objects.get(username=username)
    queryset = list(UserShow.objects.filter(
        user=user, showId=show_id).values().order_by('season'))
    return JsonResponse({"success": True, "showsJson": queryset})


# Friends

@api_view(['GET'])
def showFriends(request):
    friends = Friendship.objects.filter(user_1=request.user)
    serializer = FriendshipSerializer(friends, many=True)
    return JsonResponse({"success": True, "friends": serializer.data})


def friendshipStatus(request, user):
    isSenderPending = FriendRequest.objects.filter(
        from_user=request.user, to_user=user).exists()
    isReceiverPending = FriendRequest.objects.filter(
        from_user=user, to_user=request.user).exists()
    isUserAfriend = Friendship.objects.filter(
        user_1=request.user, user_2=user).exists()

    if isSenderPending:
        return JsonResponse({"success": True, "friendshipStatus": 'Pending_sender'})

    if isReceiverPending:
        return JsonResponse({"success": True, "friendshipStatus": 'Pending_receiver'})

    if isUserAfriend:
        return JsonResponse({"success": True, "friendshipStatus": 'Friend'})

    return JsonResponse({"success": True, "friendshipStatus": 'Not a friend'})


def sendFriendReq(request):
    data = json.loads(request.body)
    username = data["username"]
    to_user = User.objects.get(username=username)
    if Friendship.objects.filter(user_1=request.user, user_2=to_user).exists():
        return JsonResponse({"success": False, "message": "Already friends"})
    if FriendRequest.objects.filter(from_user=to_user, to_user=request.user):
        return JsonResponse({"success": False, "message": "Friend request already sent from the other user"})
    if (request.user.username == username):
        return JsonResponse({"success": False, "message": "Error"})

    friendReq, created = FriendRequest.objects.get_or_create(
        from_user=request.user, to_user=to_user)
    if not created:
        return JsonResponse({"success": False, "message": "Friend Request already sent"})

    return JsonResponse({"success": True, "message": "Friend request sent"})


@api_view(['GET'])
def showFriendReq(request):
    friendReq = FriendRequest.objects.filter(to_user=request.user)
    serializer = FriendRequestSerializer(friendReq, many=True)
    return JsonResponse({"success": True, "friendReq": serializer.data})


def friendReqDecision(request):
    data = json.loads(request.body)
    username = data["username"]
    decision = data["decision"]
    from_user = User.objects.get(username=username)
    friendReq = FriendRequest.objects.get(
        from_user=from_user, to_user=request.user)
    if not decision:
        friendReq.delete()
        return JsonResponse({"success": True, "decision": "decline"})

    obj1, created1 = Friendship.objects.get_or_create(
        user_1=request.user, user_2=from_user)
    obj2, created2 = Friendship.objects.get_or_create(
        user_1=from_user, user_2=request.user)
    friendReq.delete()
    return JsonResponse({"success": True, "decision": "accepet"})


def deleteFriend(request):
    #    Friendship.objects.get(user=request.user, friend= username).delete()
    data = json.loads(request.body)
    username = data["username"]
    user_id = User.objects.get(username=username)
    get_object_or_404(Friendship, user_1=request.user, user_2=user_id).delete()
    get_object_or_404(Friendship, user_1=user_id, user_2=request.user).delete()
    return JsonResponse({"success": True, "message": "Friend Deleted"})


def searchForUser(request, username):
    if not username:
        return JsonResponse({"success": False, "message": "No username provided"})
    searchResult = User.objects.filter(username__icontains=username).exclude(
        username=request.user).order_by(Length('username').asc())
    if not searchResult:
        return JsonResponse({"success": False, "message": "No matching users found"})

    searchList = list(searchResult.values_list('id', flat=True))
    return JsonResponse({"success": True, 'user_ids': searchList})


def favouriteHandler(request, showId, action):
    if request.method == "POST":
        data = json.loads(request.body)
        showId = data["showId"]
        action = bool(data["action"])
        user = User.objects.get(username=request.user)
        query, _ = ShowsList.objects.get_or_create(user=user, showId=showId)
        query.favorite = action
        query.save()
        return JsonResponse({'success': True, 'message': 'Favorite status updated successfully.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


def watchlistHandler(request, showId, action):
    if request.method == "POST":
        data = json.loads(request.body)
        showId = data["showId"]
        action = bool(data["action"])
        user = User.objects.get(username=request.user)
        query, _ = ShowsList.objects.get_or_create(user=user, showId=showId)
        query.watch_list = action
        query.save()
        return JsonResponse({'success': True, 'message': 'Watchlist status updated successfully.'})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


def getFavoriteStatus(request, showId):
    if request.method == "GET":
        user = request.user
        try:
            user_show = ShowsList.objects.get(user=user, showId=showId)
            return JsonResponse({'success': True, 'favorite': user_show.favorite})
        except ShowsList.DoesNotExist:
            return JsonResponse({'success': False, 'favorite': False})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


def getWatchlistStatus(request, showId):
    if request.method == "GET":
        user = request.user
        try:
            user_show = ShowsList.objects.get(user=user, showId=showId)
            return JsonResponse({'success': True, 'watchlist': user_show.watch_list})
        except ShowsList.DoesNotExist:
            return JsonResponse({'success': False, 'watchlist': False})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


def getWatchlistShows(request):
    if request.method == "GET":
        user = request.user
        try:
            user_shows = ShowsList.objects.filter(user=user, watch_list=True)
            if user_shows.exists():
                show_ids = [user_show.showId for user_show in user_shows]
                return JsonResponse({'success': True, 'watchlist': show_ids})
            else:
                return JsonResponse({'success': False, 'watchlist': []})
        except ShowsList.DoesNotExist:
            return JsonResponse({'success': False, 'watchlist': []})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


