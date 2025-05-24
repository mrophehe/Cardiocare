from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    PROVIDER_CHOICES = [
        ('google_fit', 'Google Fit'),
        ('apple_health', 'Apple Health'),
    ]
    
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, null=True, blank=True)
    provider_id = models.CharField(max_length=255, null=True, blank=True)
    access_token = models.TextField(null=True, blank=True)
    refresh_token = models.TextField(null=True, blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Health profile
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    height = models.FloatField(null=True, blank=True)  # in cm
    weight = models.FloatField(null=True, blank=True)  # in kg
    
    # Emergency settings
    emergency_auto_call = models.BooleanField(default=True)
    emergency_whatsapp = models.BooleanField(default=True)
    emergency_ai_voice = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class EmergencyContact(models.Model):
    RELATIONSHIP_CHOICES = [
        ('spouse', 'Spouse'),
        ('parent', 'Parent'),
        ('child', 'Child'),
        ('sibling', 'Sibling'),
        ('doctor', 'Doctor'),
        ('emergency', 'Emergency Services'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    priority = models.IntegerField(default=1)  # 1 = highest priority
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['priority', 'name']
