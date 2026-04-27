from rest_framework import serializers
from .models import User, Project, Task

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate_project(self, value):
        user = self.context['request'].user
        if value.user != user:
            raise serializers.ValidationError("Project does not belong to the user.")
        return value
