from rest_framework import serializers  # for creating serializer
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status']   # use for representation of serialized Task.
        
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'title', 'status')

    def create(self, validated_data):
        user = User(**validated_data)
        user.save()
        return user
