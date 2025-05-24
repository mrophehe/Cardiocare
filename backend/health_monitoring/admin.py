from django.contrib import admin
from .models import HealthData, ECGReading, AIAnalysis, HealthAlert

@admin.register(HealthData)
class HealthDataAdmin(admin.ModelAdmin):
    list_display = ('user', 'data_type', 'source', 'recorded_at', 'created_at')
    list_filter = ('data_type', 'source', 'created_at')
    search_fields = ('user__email', 'data_type')

@admin.register(ECGReading)
class ECGReadingAdmin(admin.ModelAdmin):
    list_display = ('user', 'heart_rate', 'duration', 'quality_score', 'recorded_at')
    list_filter = ('recorded_at', 'quality_score')
    search_fields = ('user__email',)

@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user', 'risk_level', 'confidence_score', 'created_at')
    list_filter = ('risk_level', 'created_at')
    search_fields = ('user__email', 'analysis_result')

@admin.register(HealthAlert)
class HealthAlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'alert_type', 'status', 'severity', 'created_at')
    list_filter = ('alert_type', 'status', 'severity', 'created_at')
    search_fields = ('user__email', 'title', 'message')
