from django.contrib import admin
from django.urls import path
from posts.views import RegisterView, PostsListCreateView, PostRetrieveView
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/posts/", PostsListCreateView.as_view(), name="posts"),
    path("api/posts/<int:pk>/", PostRetrieveView.as_view(), name="post-detail"),
    # Swagger / OpenAPI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
]
