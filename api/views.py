from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import UserShowSerializer, UserShowUpdateSerializer
from .models import UserShow


class UserShowView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = UserShow.objects.all()
    serializer_class = UserShowSerializer



class UserWathcedEpisodes(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowSerializer

    def get_queryset(self):
        user_id = self.request.GET.get('user')
        show = self.request.GET.get('show')
        show_id = int(show.strip().rstrip('/'))
        queryset = UserShow.objects.filter(user=user_id,show=show_id)
        return queryset



class UserShowUpdate(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserShowUpdateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            user_id = serializer.validated_data.get('user')
            show = int(serializer.validated_data.get('show'))
            season = int(serializer.validated_data.get('season'))
            watched_episodes = serializer.validated_data.get(
                'watched_episodes')
            watched_episodes_list = watched_episodes.split(",")

            queryset = UserShow.objects.filter(
            user=user_id, show=show, season=season)
            # if show is already in the database then update else create a new row
            if queryset.exists():
                #when user unclick a season delete it from db 
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
