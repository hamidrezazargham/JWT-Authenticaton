from django.db import models
from django.contrib.auth.models import User
'''
This is where you define your database models (the structure of your database tables).

$$$$$$$$$$$$$$$$$$$$$$$$$

Each model typically maps to a single table in the database, and Django uses these models to automatically create, read, update, and delete data from the database.
'''
class Task(models.Model):
    title = models.CharField(max_length=255, null=False, blank=False)   
    description = models.TextField(null=False, blank=False) # for longer text.
    status = models.CharField(max_length=50, choices=[
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
    ], null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

from django import forms
from .models import Task

class TaskForm(forms.ModelForm):    
    class Meta:     # specifies the model and fields to be included.
        model = Task
        fields = ['id', 'title', 'description', 'status']
