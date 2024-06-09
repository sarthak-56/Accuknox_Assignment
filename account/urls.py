from django.urls import path
from account.views import SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserProfileView, UserRegistrationView, UserPasswordResetView, SendFriendRequestView, AcceptFriendRequestView, RejectFriendRequestView, FriendRequestListView, FriendListView, UserSearchAPIView
urlpatterns = [
   
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('send-friend-request/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('accept-friend-request/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('reject-friend-request/', RejectFriendRequestView.as_view(), name='reject-friend-request'),
    path('friend-requests/', FriendRequestListView.as_view(), name='friend-requests'),
    path('friends/', FriendListView.as_view(), name='friends'),
    path('search/', UserSearchAPIView.as_view(), name='search'),

]