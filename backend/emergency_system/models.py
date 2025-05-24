from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class EmergencyResponse(models.Model):
    RESPONSE_TYPES = [
        ('whatsapp', 'WhatsApp Notification'),
        ('voice_call', 'Voice Call'),
        ('sms', 'SMS'),
        ('email', 'Email'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_responses')
    response_type = models.CharField(max_length=20, choices=RESPONSE_TYPES)
    recipient = models.CharField(max_length=255)  # phone number or email
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Twilio/external service response
    external_id = models.CharField(max_length=255, null=True, blank=True)
    response_data = models.JSONField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
