# ========== backend/apps/users/serializers.py (VERIFY THIS) ==========
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                  'profile_image', 'phone', 'is_approved', 'is_staff', 'created_at']
        #                                                    ^^^^^^^^ IMPORTANT!
        read_only_fields = ['id', 'is_approved', 'is_staff', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']
    
    def validate_role(self, value):
        # Ensure admin role cannot be selected during registration
        if value == 'admin':
            raise serializers.ValidationError("Admin role cannot be selected during registration.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            **validated_data,
            is_approved=False  # Set to False by default, needs admin approval
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Check if user is approved
        if not self.user.is_approved:
            raise serializers.ValidationError(
                "Your account is pending approval. Please contact an administrator."
            )
        
        data['user'] = UserSerializer(self.user).data
        return data

class UserApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'is_approved']