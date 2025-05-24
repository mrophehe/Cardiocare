from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class HealthData(models.Model):
    DATA_TYPES = [
        ('heart_rate', 'Heart Rate'),
        ('blood_pressure', 'Blood Pressure'),
        ('spo2', 'SpO2'),
        ('temperature', 'Temperature'),
        ('ecg', 'ECG'),
        ('steps', 'Steps'),
        ('sleep', 'Sleep'),
        ('weight', 'Weight'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_data')
    data_type = models.CharField(max_length=20, choices=DATA_TYPES)
    value = models.JSONField()  # Store flexible health data
    unit = models.CharField(max_length=20)
    source = models.CharField(max_length=50)  # google_fit, apple_health, manual
    recorded_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['user', 'data_type', 'recorded_at']),
        ]

class ECGReading(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ecg_readings')
    waveform_data = models.JSONField()  # Array of ECG values
    heart_rate = models.IntegerField()
    duration = models.IntegerField()  # in seconds
    quality_score = models.FloatField(default=0.0)
    anomalies_detected = models.JSONField(default=list)
    recorded_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

class AIAnalysis(models.Model):
    RISK_LEVELS = [
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
        ('critical', 'Critical'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_analyses')
    health_data = models.JSONField()  # Input data for analysis
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS)
    analysis_result = models.TextField()
    prediction = models.TextField()
    confidence_score = models.FloatField()
    recommendations = models.JSONField(default=list)
    time_to_emergency = models.CharField(max_length=50, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class HealthAlert(models.Model):
    ALERT_TYPES = [
        ('emergency', 'Emergency'),
        ('warning', 'Warning'),
        ('info', 'Information'),
    ]
    
    ALERT_STATUS = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=ALERT_STATUS, default='active')
    severity = models.CharField(max_length=10, default='medium')
    
    # Related data
    ai_analysis = models.ForeignKey(AIAnalysis, on_delete=models.SET_NULL, null=True, blank=True)
    health_data = models.JSONField(null=True, blank=True)
    
    # Emergency response
    emergency_call_initiated = models.BooleanField(default=False)
    contacts_notified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
