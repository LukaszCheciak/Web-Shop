from django.shortcuts import render
from rest_framework import permissions, viewsets, mixins
from rest_framework.viewsets import GenericViewSet

from backend.orders.models import Order
from backend.orders.serializers import OrderSerializer
from backend.products.models import Product


class OrderViewSet(mixins.CreateModelMixin, GenericViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        print(serializer.validated_data["items"])
        for product in serializer.validated_data["items"]:
            product_instance = Product.objects.get(id=product["id"])
            product_instance.stock -= product["quantity"]
            product_instance.save()

