from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, EmergencyContact

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'provider', 'created_at')
    list_filter = ('provider', 'emergency_auto_call', 'created_at')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Health Provider', {'fields': ('provider', 'provider_id', 'access_token')}),
        ('Emergency Settings', {'fields': ('emergency_auto_call', 'emergency_whatsapp', 'emergency_ai_voice')}),
    )

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'relationship', 'priority', 'is_active')
    list_filter = ('relationship', 'priority', 'is_active')
    search_fields = ('name', 'user__email')
