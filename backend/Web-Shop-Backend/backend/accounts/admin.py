from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from backend.accounts.models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    pass
