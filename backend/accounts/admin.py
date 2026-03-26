from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Organization

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Organization Info', {
            'fields': ('organization', 'role')
        }),
    )
    list_display = ['username', 'email', 'organization', 'role', 'is_staff']

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'subscription_plan', 'created_at']