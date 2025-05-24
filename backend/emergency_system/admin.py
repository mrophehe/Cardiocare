from django.contrib import admin
from .models import EmergencyResponse

@admin.register(EmergencyResponse)
class EmergencyResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'response_type', 'recipient', 'status', 'created_at')
    list_filter = ('response_type', 'status', 'created_at')
    search_fields = ('user__email', 'recipient', 'message')
