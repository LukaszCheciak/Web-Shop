from djoser.views import UserViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from backend.accounts.models import CustomUser
from backend.accounts.serializers import ProfileSerializer
from backend.orders.serializers import OrderSerializer


class CustomUserViewSet(UserViewSet):
    pass


class ProfileViewSet(GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializer

    @action(detail=False, methods=["get"])
    def orders(self, request, *args, **kwargs):
        user = request.user
        orders = user.order_set.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def update_shipping_info(self, request, *args, **kwargs):
        user = request.user
        user.address = request.data.get("address")
        user.city = request.data.get("city")
        user.postal_code = request.data.get("postal_code")
        user.save()
        return Response({"message": "Shipping info updated"})

