# ========== backend/apps/users/urls.py (UPDATED) ==========
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    CustomTokenObtainPairView, 
    UserListView, 
    UserDetailView,
    PendingUsersView,
    ApproveUserView,
    RejectUserView,
    AllUsersManagementView,
    DeleteUserView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User info
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    # Admin-only user management
    path('admin/users/pending/', PendingUsersView.as_view(), name='pending-users'),
    path('admin/users/all/', AllUsersManagementView.as_view(), name='all-users-management'),
    path('admin/users/<int:user_id>/approve/', ApproveUserView.as_view(), name='approve-user'),
    path('admin/users/<int:user_id>/reject/', RejectUserView.as_view(), name='reject-user'),
    path('admin/users/<int:user_id>/delete/', DeleteUserView.as_view(), name='delete-user'),
]