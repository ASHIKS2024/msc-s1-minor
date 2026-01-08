from rest_framework import serializers
from .models import Task, Comment
from apps.users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    sprint_name = serializers.CharField(source='sprint.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']
