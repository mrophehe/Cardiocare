from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
import requests
import json
from .models import HealthData, ECGReading, AIAnalysis, HealthAlert
from .tasks import analyze_health_data

@api_view(['GET'])
def get_current_health_metrics(request):
    """Get current health metrics"""
    user = request.user
    
    # Get latest readings for each metric
    latest_heart_rate = HealthData.objects.filter(
        user=user, data_type='heart_rate'
    ).first()
    
    latest_blood_pressure = HealthData.objects.filter(
        user=user, data_type='blood_pressure'
    ).first()
    
    latest_spo2 = HealthData.objects.filter(
        user=user, data_type='spo2'
    ).first()
    
    latest_temperature = HealthData.objects.filter(
        user=user, data_type='temperature'
    ).first()
    
    # Return current metrics (with mock data for demo)
    current_metrics = {
        'heartRate': latest_heart_rate.value.get('bpm', 89) if latest_heart_rate else 89,
        'bloodPressure': {
            'systolic': latest_blood_pressure.value.get('systolic', 140) if latest_blood_pressure else 140,
            'diastolic': latest_blood_pressure.value.get('diastolic', 90) if latest_blood_pressure else 90
        },
        'spo2': latest_spo2.value.get('percentage', 97) if latest_spo2 else 97,
        'temperature': latest_temperature.value.get('celsius', 37.0) if latest_temperature else 98.6,
        'riskLevel': 'High Risk'
    }
    
    return Response(current_metrics)

@api_view(['POST'])
def submit_ecg_data(request):
    """Submit ECG reading for analysis"""
    user = request.user
    waveform_data = request.data.get('waveform_data', [])
    heart_rate = request.data.get('heart_rate', 0)
    
    # Create ECG reading
    ecg_reading = ECGReading.objects.create(
        user=user,
        waveform_data=waveform_data,
        heart_rate=heart_rate,
        duration=len(waveform_data) // 250,  # Assuming 250 Hz sampling rate
        recorded_at=timezone.now()
    )
    
    # Trigger AI analysis
    analyze_health_data.delay(user.id, ecg_reading.id)
    
    return Response({
        'ecg_id': ecg_reading.id,
        'message': 'ECG data submitted for analysis'
    })

@api_view(['GET'])
def get_ai_analysis(request):
    """Get latest AI analysis"""
    user = request.user
    
    latest_analysis = AIAnalysis.objects.filter(user=user).first()
    
    if latest_analysis:
        return Response({
            'analysis_result': latest_analysis.analysis_result,
            'prediction': latest_analysis.prediction,
            'confidence_score': latest_analysis.confidence_score,
            'recommendations': latest_analysis.recommendations,
            'risk_level': latest_analysis.risk_level,
            'created_at': latest_analysis.created_at
        })
    else:
        # Return mock analysis for demo
        return Response({
            'analysis_result': 'Abnormal QRS complex indicating potential arrhythmia',
            'prediction': 'Immediate medical attention recommended',
            'confidence_score': 0.95,
            'recommendations': [
                'Seek immediate medical attention',
                'Contact emergency services',
                'Take prescribed emergency medication if available'
            ],
            'risk_level': 'high'
        })

@api_view(['POST'])
def sync_google_fit_data(request):
    """Sync health data from Google Fit"""
    user = request.user
    
    if user.provider != 'google_fit' or not user.access_token:
        return Response(
            {'error': 'Google Fit not connected'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Mock successful sync for demo
        return Response({'message': 'Data synced successfully from Google Fit'})
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_health_alerts(request):
    """Get user's health alerts"""
    user = request.user
    alerts = HealthAlert.objects.filter(user=user)[:20]
    
    alert_data = []
    for alert in alerts:
        alert_data.append({
            'id': alert.id,
            'type': alert.alert_type,
            'title': alert.title,
            'message': alert.message,
            'status': alert.status,
            'severity': alert.severity,
            'created_at': alert.created_at.isoformat(),
            'resolved_at': alert.resolved_at.isoformat() if alert.resolved_at else None
        })
    
    return Response(alert_data)
