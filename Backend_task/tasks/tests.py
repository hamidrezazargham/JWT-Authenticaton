from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Task
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.test import APITestCase

class TaskManagementTests(APITestCase):

    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Generate JWT token for the user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def authenticate(self):
        # Set the authorization header with the JWT token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    # Test task creation
    def test_task_creation(self):
        self.authenticate()  # Authenticate using JWT token

        url = reverse('tasks-list')  # Make sure 'tasks-list' exists in your urls.py
        data = {
            'title': 'Test Task',
            'description': 'Test Task Description',
            'status': 'To Do'
        }

        # Send POST request to create a task
        response = self.client.post(url, data, format='json')

        # Check if task creation was successful (201 Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    ### Task Retrieval Test ###
    def test_task_retrieval(self):
        # Create a task manually for this user
        self.authenticate()  # Authenticate using JWT token
        
        Task.objects.create(
            title='Existing Task',
            description='Task already in the database',
            status='To Do',
            user=self.user
        )

        url = reverse('tasks-list')  # Assuming this URL retrieves tasks for the user

        # Send the request to retrieve tasks
        response = self.client.get(url, format='json')

        print(response)
        # Check if task retrieval is successful (status code 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the task is returned in the response
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Existing Task')
        
    def test_task_update(self):
        
        self.authenticate()  # Authenticate using JWT token
        
        # Create a task for testing updates
        self.task = Task.objects.create(
            title='Original Task',
            description='Original Description',
            status='To Do',
            user=self.user  # Associate the task with the authenticated user
        )
        
        # URL for the task detail/update view (ensure it matches your urls.py)
        url = reverse('task-detail', kwargs={'pk': self.task.id})  # Use the correct 'task-detail' view name

        # New data for updating the task
        updated_data = {
            'title': 'Updated Task',
            'description': 'Updated Description',
            'status': 'In Progress',
        }

        # Send PUT request to update the task
        response = self.client.put(url, updated_data, format='json')

        # Check that the update was successful (200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh the task from the database to check the updated data
        self.task.refresh_from_db()

        # Verify the task was updated
        self.assertEqual(self.task.title, 'Updated Task')
        self.assertEqual(self.task.description, 'Updated Description')
        self.assertEqual(self.task.status, 'In Progress')
