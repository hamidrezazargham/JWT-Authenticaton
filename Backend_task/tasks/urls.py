from django.urls import path
from django.contrib.auth import views as auth_views
from tasks import views as b_view  # Make sure your views are imported
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from .views import TaskListCreate
from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    # path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    # path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),
    # path('logout/', b_view.logout_view, name='logout'),
    # path('homepage/', b_view.home, name='home'),
    # path('register/', b_view.register, name='register'),  # Assuming you have a custom register view
    # urls.py
    # path('api/', include(router.urls)),
    # path('api/', b_view.TaskListCreateView.as_view(), name='task-list'),  # Adjust view if needed
    # path('api/', TaskListCreate.as_view(), name='task-list'),  # Adjust as needed
    path('', include(router.urls)),

]