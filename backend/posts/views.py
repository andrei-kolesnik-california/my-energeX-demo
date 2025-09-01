from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from .serializers import RegisterSerializer, PostSerializer
from .models import Post
from .cache_utils import get_json, set_json, del_key, key_exists, ALL_KEY, ONE_KEY

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response({"id": user.id, "name": user.username, "email": user.email}, status=status.HTTP_201_CREATED)

class PostsListCreateView(ListCreateAPIView):
    queryset = Post.objects.select_related("user").order_by("-created_at")
    serializer_class = PostSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        cached = get_json(ALL_KEY)
        if cached is not None:
            return Response(cached)
        qs = self.get_queryset()
        data = PostSerializer(qs, many=True).data
        set_json(ALL_KEY, data)
        return Response(data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        ser = PostSerializer(data=data)
        ser.is_valid(raise_exception=True)
        ser.save(user=request.user)
        # invalidate list cache
        if key_exists(ALL_KEY):
            del_key(ALL_KEY)
        return Response(ser.data, status=status.HTTP_201_CREATED)

class PostRetrieveView(RetrieveAPIView):
    queryset = Post.objects.select_related("user")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        key = ONE_KEY.format(pk)
        cached = get_json(key)
        if cached is not None:
            return Response(cached)
        instance = self.get_object()
        data = PostSerializer(instance).data
        set_json(key, data)
        return Response(data)
