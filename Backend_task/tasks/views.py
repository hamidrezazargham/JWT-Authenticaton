from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task, TaskForm
from .serializers import TaskSerializer
'''

&&&&&&&&&&&&&&&
This file contains the logic behind your web pages or API endpoints.

'''
class TaskViewSet(viewsets.ModelViewSet):   # provide CRUD op. for model
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # add owner user of the task

from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)    # log the user into application as authenticated
            messages.success(request, 'Registration successful!')
            return redirect('/login')  # Redirect to home page after successful registration
    else:
        form = UserCreationForm()

    return render(request, 'registration/register.html', {'form': form})

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import TaskSerializer

# List all tasks or create a new task
class TaskListCreateView(generics.ListCreateAPIView):   # provides GET & POST for model
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # add owner user of the task


# Retrieve, Update or Delete a specific task
class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

# Ensure the user is logged in before accessing the home page
@login_required(login_url='/login/')
def home(request):
    # Fetch the authenticated user's tasks
    tasks = Task.objects.filter(user=request.user)

    # Handle POST request (creating a new task)
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user  # Assign the task to the current user
            task.save()
            return redirect('home')
    else:
        form = TaskForm()

    return render(request, 'home.html', {'tasks': tasks, 'form': form})

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from .models import Task
import json

# API endpoint to handle PUT and DELETE operations
@login_required(login_url='/login/')
@require_http_methods(["DELETE", "PUT"])
def task_api(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)

    if request.method == 'DELETE':
        task.delete()
        return JsonResponse({'message': 'Task deleted successfully'})

    if request.method == 'PUT':
        try:
            # Decode and parse the request body (which is in bytes)
            data = json.loads(request.body.decode('utf-8'))

            # Ensure all required fields are present
            title = data.get('title')
            description = data.get('description')
            status = data.get('status')

            if not title or not description or not status:
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            # Update task fields
            task.title = title
            task.description = description
            task.status = status
            task.save()

            return JsonResponse({'message': 'Task updated successfully'})
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.shortcuts import redirect
from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    response = redirect('/login/')
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

