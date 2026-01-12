from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Project Manager'),
        ('developer', 'Developer'),
        ('tester', 'Tester'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='developer')
    profile_image = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username
