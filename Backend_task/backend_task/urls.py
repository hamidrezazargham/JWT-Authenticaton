"""
URL configuration for backend_task project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as a_view  # Make sure your views are imported
from tasks import views as b_view  # Make sure your views are imported

urlpatterns = [
    path('', a_view.LoginView.as_view(), name='login'),
    path('tasks/api/<int:task_id>/', b_view.task_api, name='task_api'),
    path('admin/', admin.site.urls),
    path('homepage/', b_view.home, name='home'),
    path('api/', include('tasks.urls')),  # Add API routes for tasks
    path('login/', a_view.LoginView.as_view(), name='login'),  # Assuming you're using Django's built-in login view
    path('logout/', b_view.logout_view, name='logout'),  # Logout URL
    path('register/', b_view.register, name='register'),  # Assuming you have a custom register view
    path('tasks/', b_view.TaskListCreateView.as_view(), name='tasks-list'),  # List and create tasks     #this was an error, this line added while unit testing.

]
