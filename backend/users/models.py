
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Remove inherited first_name/last_name entirely
    first_name = None
    last_name = None

    full_name = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return self.username
