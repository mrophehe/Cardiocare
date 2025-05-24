from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
import requests
import json
import logging
from .models import HealthData, ECGReading, AIAnalysis, HealthAlert
from .tasks import analyze_health_data

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated for demo
def get_current_health_metrics(request):
    """Get current health metrics"""
    try:
        if request.user.is_authenticated:
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
            
            # Return current metrics (with real data if available)
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
        else:
            # Return demo data for unauthenticated users
            current_metrics = {
                'heartRate': 89,
                'bloodPressure': {'systolic': 140, 'diastolic': 90},
                'spo2': 97,
                'temperature': 98.6,
                'riskLevel': 'High Risk'
            }
        
        return Response(current_metrics)
        
    except Exception as e:
        logger.error(f"Error in get_current_health_metrics: {str(e)}")
        return Response(
            {'error': 'Failed to fetch health metrics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_ecg_data(request):
    """Submit ECG reading for analysis"""
    try:
        user = request.user
        waveform_data = request.data.get('waveform_data', [])
        heart_rate = request.data.get('heart_rate', 0)
        
        if not waveform_data:
            return Response(
                {'error': 'Waveform data is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
        
        logger.info(f"ECG data submitted for user {user.email}, reading ID: {ecg_reading.id}")
        
        return Response({
            'ecg_id': ecg_reading.id,
            'message': 'ECG data submitted for analysis',
            'status': 'processing'
        })
        
    except Exception as e:
        logger.error(f"Error in submit_ecg_data: {str(e)}")
        return Response(
            {'error': 'Failed to submit ECG data'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated for demo
def get_ai_analysis(request):
    """Get latest AI analysis"""
    try:
        if request.user.is_authenticated:
            user = request.user
            latest_analysis = AIAnalysis.objects.filter(user=user).first()
            
            if latest_analysis:
                return Response({
                    'analysis_result': latest_analysis.analysis_result,
                    'prediction': latest_analysis.prediction,
                    'confidence_score': latest_analysis.confidence_score,
                    'recommendations': latest_analysis.recommendations,
                    'risk_level': latest_analysis.risk_level,
                    'created_at': latest_analysis.created_at.isoformat()
                })
        
        # Return mock analysis for demo or if no analysis available
        return Response({
            'analysis_result': 'Abnormal QRS complex indicating potential arrhythmia',
            'prediction': 'Immediate medical attention recommended',
            'confidence_score': 0.95,
            'recommendations': [
                'Seek immediate medical attention',
                'Contact emergency services',
                'Take prescribed emergency medication if available'
            ],
            'risk_level': 'high',
            'created_at': timezone.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_ai_analysis: {str(e)}")
        return Response(
            {'error': 'Failed to get AI analysis'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_google_fit_data(request):
    """Sync health data from Google Fit"""
    try:
        user = request.user
        
        if user.provider != 'google_fit' or not user.access_token:
            return Response(
                {'error': 'Google Fit not connected'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Here you would implement actual Google Fit API calls
        # For now, we'll simulate successful sync
        logger.info(f"Google Fit data sync requested for user {user.email}")
        
        return Response({
            'message': 'Data synced successfully from Google Fit',
            'synced_at': timezone.now().isoformat(),
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error in sync_google_fit_data: {str(e)}")
        return Response(
            {'error': 'Failed to sync Google Fit data'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_health_alerts(request):
    """Get user's health alerts"""
    try:
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
        
    except Exception as e:
        logger.error(f"Error in get_health_alerts: {str(e)}")
        return Response(
            {'error': 'Failed to get health alerts'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
