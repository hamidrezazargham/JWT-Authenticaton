from django.urls import path
from django.contrib.auth import views as auth_views
from tasks import views as b_view  # Make sure your views are imported
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from .views import TaskListCreate
from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView, login
from django.contrib.auth import views as a_view  # Make sure your views are imported


urlpatterns = [
    path('list/', TaskListCreateView.as_view(), name='task-list-create'),
    path('<int:pk>/', TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),
    path('logout/', b_view.logout_view, name='logout'),
    path('login/', login, name='login'),  
]