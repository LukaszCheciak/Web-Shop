from rest_framework import serializers

from backend.products.models import Product, Review


class ReviewSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = Review
        fields = (
            "product",
            "user",
            "rating",
            "title",
            "content",
        )


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "description",
            "category",
            "price",
            "image",
            "stock",
        )

    def get_can_review(self, obj):
        if not self.context["request"].user.is_authenticated:
            return False
        return not obj.review_set.filter(user=self.context["request"].user).exists()
