from rest_framework import serializers  # for creating serializer
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status']   # use for representation of serialized Task.