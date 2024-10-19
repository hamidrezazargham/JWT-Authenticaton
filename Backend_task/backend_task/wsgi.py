"""
WSGI config for backend_task project.
Web Server Gateway Interface.
It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_task.settings')

application = get_wsgi_application()    #production of a wsgi application object based on project's settings.
