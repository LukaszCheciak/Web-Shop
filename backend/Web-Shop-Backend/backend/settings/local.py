from .base import *

SECRET_KEY = "secret_key"

# ------------- DATABASES -------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", "backend"),
        "USER": env("POSTGRES_USER", "backend"),
        "PASSWORD": env("POSTGRES_PASSWORD", "backend"),
        "HOST": env("POSTGRES_HOST", "localhost"),
    }
}
