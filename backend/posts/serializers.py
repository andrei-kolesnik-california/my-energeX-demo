
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Post

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "full_name", "email", "password")

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        username = validated_data.pop("username")
        password = validated_data.pop("password")
        full_name = validated_data.pop("full_name", "")
        email = validated_data.pop("email", "")

        user = User(username=username, email=email, full_name=full_name)
        user.set_password(password)
        user.save()
        return user

class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ("id", "title", "content", "user_id", "user_full_name", "created_at")

    def get_user_full_name(self, obj):
        return obj.user.first_name or obj.user.username