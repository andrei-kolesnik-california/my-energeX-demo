# serializers with SignupSerializer, LoginSerializer, UserOutSerializer

from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    username   = serializers.CharField(min_length=3, max_length=150)
    full_name  = serializers.CharField(required=False, allow_blank=True, max_length=150)
    email      = serializers.EmailField()
    password   = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, v):
        if User.objects.filter(username=v).exists():
            raise serializers.ValidationError("username_taken")
        return v

    def validate_email(self, v):
        if User.objects.filter(email=v).exists():
            raise serializers.ValidationError("email_taken")
        return v

    def create(self, data):
        full_name = data.get("full_name", "")
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
        if full_name:
            user.first_name = full_name
            user.save(update_fields=["first_name"])
        return user