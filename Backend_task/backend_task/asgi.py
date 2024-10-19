"""
ASGI config for backend_task project.
Asynchronous Server Gateway Interface.
It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_task.settings')

application = get_asgi_application()    # production of a asgi application object based on project's settings.
