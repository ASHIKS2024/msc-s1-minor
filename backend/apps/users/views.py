# ========== backend/apps/users/views.py (COMPLETE) ==========
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_approved=True)  # Only approved users
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# ============ ADMIN-ONLY VIEWS ============

class IsAdminUser(permissions.BasePermission):
    """Custom permission to only allow admins"""
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class PendingUsersView(generics.ListAPIView):
    """Get all pending (not approved) users"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return User.objects.filter(is_approved=False, is_staff=False)

class AllUsersManagementView(generics.ListAPIView):
    """Get all users (approved + pending) for admin management"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return User.objects.filter(is_staff=False).order_by('-created_at')

class ApproveUserView(APIView):
    """Approve a pending user"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_staff=False)
            user.is_approved = True
            user.save()
            return Response({
                'message': f'User {user.username} approved successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class RejectUserView(APIView):
    """Reject (delete) a pending user"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_staff=False)
            username = user.username
            user.delete()
            return Response({
                'message': f'User {username} rejected and removed'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class DeleteUserView(APIView):
    """Delete any user (approved or pending)"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, is_staff=False)
            username = user.username
            user.delete()
            return Response({
                'message': f'User {username} deleted successfully'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)