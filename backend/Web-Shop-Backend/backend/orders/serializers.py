from rest_framework import serializers

from backend.orders.models import Order
from backend.products.models import Product, Review


class OrderSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(source="created_at", read_only=True, format="%Y-%m-%d")

    class Meta:
        model = Order
        fields = (
            "total",
            "items",
            "date",
        )

