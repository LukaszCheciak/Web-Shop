from django.contrib import admin

from backend.orders.models import Order


class OrderAdmin(admin.ModelAdmin):
    pass


admin.site.register(Order, OrderAdmin)
