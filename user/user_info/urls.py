from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet

router = routers.DefaultRouter()
router.register(r'user-info', UserViewSet)

urlpatterns = [
    path('', include(router.urls))
]