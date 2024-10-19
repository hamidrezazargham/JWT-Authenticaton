from django.apps import AppConfig   #base class for django app creation.

class TasksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'    #for primary keys.
    name = 'tasks'
