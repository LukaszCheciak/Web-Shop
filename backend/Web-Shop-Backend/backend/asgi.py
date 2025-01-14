import os

from django.core.wsgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings.production")

application = get_asgi_application()
