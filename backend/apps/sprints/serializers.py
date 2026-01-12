from rest_framework import serializers
from .models import Sprint

class SprintSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = Sprint
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']