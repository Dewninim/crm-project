from django.db import models
from django.contrib.auth.models import AbstractUser

class Organization(models.Model):
    PLAN_CHOICES = [('Basic', 'Basic'), ('Pro', 'Pro')]
    name = models.CharField(max_length=255)
    subscription_plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default='Basic')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Staff', 'Staff'),
    ]
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Staff')

    def __str__(self):
        return f"{self.username} ({self.role})"