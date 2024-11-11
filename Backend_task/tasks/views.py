from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task, TaskForm
from .serializers import TaskSerializer, UserSerializer
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
from django.views.decorators.csrf import csrf_exempt

# views.py
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token


from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token

@api_view(['POST'])
def login(request):
    # Get username and password from the request
    username = request.data.get('username')
    password = request.data.get('password')

    # Check if username and password are provided
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Authenticate the user
    user = authenticate(username=username, password=password)

    if user is not None:
        # User is authenticated, generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Get CSRF token (you might want to include this in your response)
        csrf_token = get_token(request)

        return Response({
            'message': 'Login successful',
            'token': access_token,  # Return JWT token in the response
            'csrfToken': csrf_token  # Include the CSRF token in the response
        }, status=status.HTTP_200_OK)

    else:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def login(request):
#     # Get username and password from the request
#     username = request.data.get('username')
#     password = request.data.get('password')

#     # Check if username and password are provided
#     if not username or not password:
#         return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

#     # Authenticate the user
#     user = authenticate(username=username, password=password)

#     if user is not None:
#         # User is authenticated, generate JWT token
#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)

#         # Get CSRF token (you might want to include this in your response)
#         csrf_token = get_token(request)

#         return Response({
#             'message': 'Login successful',
#             'token': access_token,
#             'csrfToken': csrf_token  # Include the CSRF token in the response
#         }, status=status.HTTP_200_OK)

#     else:
#         return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Check if username and password are provided
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response({'error': 'User with this username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create new user
    user = User.objects.create_user(username=username, password=password)
    user.save()

    # Generate JWT token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    # Generate CSRF token (in case frontend expects it)
    csrf_token = get_token(request)

    return Response({
        'message': 'User registered successfully',
        'token': access_token,
        'csrfToken': csrf_token
    }, status=status.HTTP_201_CREATED)


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

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Task
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
@require_POST
def update_task_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Load the JSON data
            task_id = int(data.get('task_id'))  
            new_status = data.get('status') 
            task = Task.objects.get(id=task_id)
            if new_status == "To Do":
                task.status = 'To Do'
            elif new_status == "In Progress":
                task.status = 'In Progress'
            elif new_status == "Done":
                task.status = 'Done' 
            task.save()

            return JsonResponse({'success': True})
        except Task.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Task not found.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskListCreate(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
