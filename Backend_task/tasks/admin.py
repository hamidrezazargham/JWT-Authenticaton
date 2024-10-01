from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Task  # Import the Task model

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'status', 'user')  # Fields to display in the admin list view
    search_fields = ('title', 'description', 'user__username')  # Enable search by title, description, and username
    list_filter = ('status', 'user')  # Filters to filter by status and user
