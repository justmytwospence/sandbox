from django.urls import path, include
from .views import upload_gpx, get_courses
from rest_framework.routers import DefaultRouter
from .viewsets import CourseViewSet  # Import your viewset

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    path('upload-gpx/', upload_gpx, name='upload_gpx'),
    path('get-courses/', get_courses, name='get_courses'),
    path('', include(router.urls)),  # Include the router URLs
]