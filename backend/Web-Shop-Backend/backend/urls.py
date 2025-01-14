from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from django.conf.urls.static import static
from django.conf import settings

from backend.accounts.views import ProfileViewSet
from backend.orders.views import OrderViewSet
from backend.products.views import ProductListView, ReviewViewSet

schema_view = get_schema_view(
    openapi.Info(
        title="Sample Django app API",
        default_version="v1",
        contact=openapi.Contact(email="mail@example.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()

router.register(r'reviews', ReviewViewSet)
router.register(r'products', ProductListView)
router.register(r'orders', OrderViewSet)
router.register(r'profile', ProfileViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path(
        "api/swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger",
    ),
    path("api/accounts/", include("backend.accounts.urls")),
    path("i18n/", include("django.conf.urls.i18n")),
]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)