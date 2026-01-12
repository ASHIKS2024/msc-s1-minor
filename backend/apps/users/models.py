# ========== backend/apps/users/models.py (ADD THIS METHOD) ==========
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('manager', 'Project Manager'),
        ('developer', 'Developer'),
        ('tester', 'Tester'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='developer')
    profile_image = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # Auto-approve staff/superusers
        if self.is_staff or self.is_superuser:
            self.is_approved = True
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.username