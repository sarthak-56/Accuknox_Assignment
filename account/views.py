from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, FriendRequestSerializer, UserSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import FriendRequest, Friendship, User 
from django.shortcuts import get_object_or_404
from django.db.models import Q


def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    user = authenticate(email=email, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        to_user_id = request.data.get('to_user_id')
        to_user = get_object_or_404(User, id=to_user_id)
        from_user = request.user
        if from_user == to_user:
            return Response({'error': 'You cannot send a friend request to yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            return Response({'error': 'Friend request already sent.'}, status=status.HTTP_400_BAD_REQUEST)
        if Friendship.objects.filter(Q(user1=from_user, user2=to_user) | Q(user1=to_user, user2=from_user)).exists():
            return Response({'error': 'You are already friends.'}, status=status.HTTP_400_BAD_REQUEST)
        friend_request = FriendRequest(from_user=from_user, to_user=to_user)
        friend_request.save()
        return Response({'msg': 'Friend request sent successfully.'}, status=status.HTTP_201_CREATED)

class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        friend_request_id = request.data.get('friend_request_id')
        friend_request = get_object_or_404(FriendRequest, id=friend_request_id)
        if friend_request.to_user != request.user:
            return Response({'error': 'You cannot accept this friend request.'}, status=status.HTTP_400_BAD_REQUEST)
        friend_request.accepted = True
        friend_request.save()
        Friendship.objects.create(user1=friend_request.from_user, user2=friend_request.to_user)
        return Response({'msg': 'Friend request accepted.'}, status=status.HTTP_200_OK)

class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        friend_request_id = request.data.get('friend_request_id')
        friend_request = get_object_or_404(FriendRequest, id=friend_request_id)
        if friend_request.to_user != request.user:
            return Response({'error': 'You cannot reject this friend request.'}, status=status.HTTP_400_BAD_REQUEST)
        friend_request.rejected = True
        friend_request.save()
        return Response({'msg': 'Friend request rejected.'}, status=status.HTTP_200_OK)

class FriendRequestListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        friend_requests = FriendRequest.objects.filter(to_user=request.user, accepted=False)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FriendListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        friendships = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
        friends = []
        for friendship in friendships:
            friend = friendship.user1 if friendship.user2 == user else friendship.user2
            friends.append(friend)
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserSearchAPIView(APIView):
    renderer_classes = [UserRenderer]

    def get(self, request, *args, **kwargs):
        search_keyword = request.query_params.get('q', '')
        # print(search_keyword)
        users_by_email = User.objects.filter(email=search_keyword)
        users_by_name = User.objects.filter(name__icontains=search_keyword)
        users = users_by_email | users_by_name
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
