from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from backend.products.models import Product, Review
from backend.products.serializers import ProductSerializer, ReviewSerializer


class ProductListView(mixins.ListModelMixin, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(methods=["get"], detail=True)
    def reviews(self, request, *args, **kwargs):
        product = self.get_object()
        reviews = product.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(methods=["get"], detail=True)
    def can_review(self, request, *args, **kwargs):
        product = self.get_object()
        can_review = True
        if request.user.is_authenticated:
            can_review = not product.review_set.filter(user=request.user).exists()
        return Response({"can_review": can_review})

class ReviewViewSet(GenericViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    @action(methods=["post"], detail=False)
    def submit_review(self, request):
        data = request.data.copy()
        data["user"] = request.user.pk
        serializer_instance = self.get_serializer_class()(data=data)
        serializer_instance.is_valid(raise_exception=True)
        serializer_instance.save()

        return Response({"message": "Review submitted successfully."})