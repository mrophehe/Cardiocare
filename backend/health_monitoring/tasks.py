from celery import shared_task
from django.contrib.auth import get_user_model
from .models import ECGReading, AIAnalysis, HealthAlert
import requests
import json
from django.conf import settings
from django.utils import timezone

User = get_user_model()

@shared_task
def analyze_health_data(user_id, ecg_reading_id=None):
    """Analyze health data using OpenRouter AI"""
    try:
        user = User.objects.get(id=user_id)
        
        # Gather recent health data
        health_data = {
            'user_id': user_id,
            'timestamp': timezone.now().isoformat(),
        }
        
        if ecg_reading_id:
            ecg_reading = ECGReading.objects.get(id=ecg_reading_id)
            health_data['ecg'] = {
                'waveform': ecg_reading.waveform_data,
                'heart_rate': ecg_reading.heart_rate,
                'duration': ecg_reading.duration
            }
        
        # Call OpenRouter AI for analysis
        analysis_result = call_openrouter_ai(health_data)
        
        # Create AI analysis record
        ai_analysis = AIAnalysis.objects.create(
            user=user,
            health_data=health_data,
            risk_level=analysis_result['risk_level'],
            analysis_result=analysis_result['analysis'],
            prediction=analysis_result['prediction'],
            confidence_score=analysis_result['confidence'],
            recommendations=analysis_result['recommendations'],
            time_to_emergency=analysis_result.get('time_to_emergency')
        )
        
        # Check if emergency response is needed
        if analysis_result['risk_level'] in ['high', 'critical']:
            trigger_emergency_alert.delay(user_id, ai_analysis.id)
        
        return ai_analysis.id
        
    except Exception as e:
        print(f"Error in analyze_health_data: {str(e)}")
        return None

def call_openrouter_ai(health_data):
    """Call OpenRouter AI API for health analysis"""
    if not settings.OPENROUTER_API_KEY:
        # Return mock analysis if no API key
        return {
            'risk_level': 'high',
            'analysis': 'Abnormal QRS complex indicating potential arrhythmia',
            'prediction': 'Immediate medical attention recommended',
            'confidence': 0.95,
            'recommendations': [
                'Seek immediate medical attention',
                'Contact emergency services',
                'Take prescribed emergency medication if available'
            ]
        }
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    Analyze the following health data and provide a medical assessment:
    
    Health Data: {json.dumps(health_data, indent=2)}
    
    Please provide:
    1. Risk level (low, medium, high, critical)
    2. Medical analysis of the data
    3. Prediction of potential health issues
    4. Confidence score (0-1)
    5. Recommendations
    6. Time to potential emergency (if applicable)
    
    Respond in JSON format.
    """
    
    payload = {
        "model": "anthropic/claude-3-haiku",
        "messages": [
            {
                "role": "system",
                "content": "You are a medical AI assistant specialized in analyzing health data and detecting emergencies."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.1
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        ai_response = response.json()
        content = ai_response['choices'][0]['message']['content']
        
        # Parse JSON response
        analysis_result = json.loads(content)
        
        return {
            'risk_level': analysis_result.get('risk_level', 'medium'),
            'analysis': analysis_result.get('analysis', 'Analysis completed'),
            'prediction': analysis_result.get('prediction', 'No immediate concerns'),
            'confidence': analysis_result.get('confidence', 0.8),
            'recommendations': analysis_result.get('recommendations', []),
            'time_to_emergency': analysis_result.get('time_to_emergency')
        }
        
    except Exception as e:
        print(f"Error calling OpenRouter AI: {str(e)}")
        # Return default analysis if AI fails
        return {
            'risk_level': 'medium',
            'analysis': 'Unable to complete AI analysis',
            'prediction': 'Manual review recommended',
            'confidence': 0.5,
            'recommendations': ['Consult healthcare provider'],
            'time_to_emergency': None
        }

@shared_task
def trigger_emergency_alert(user_id, ai_analysis_id):
    """Trigger emergency alert and notifications"""
    try:
        user = User.objects.get(id=user_id)
        ai_analysis = AIAnalysis.objects.get(id=ai_analysis_id)
        
        # Create health alert
        health_alert = HealthAlert.objects.create(
            user=user,
            alert_type='emergency',
            title='Critical Health Alert',
            message=ai_analysis.analysis_result,
            severity='high',
            ai_analysis=ai_analysis
        )
        
        # Send notifications via Twilio
        if user.emergency_whatsapp:
            send_emergency_notifications.delay(user_id, health_alert.id)
        
        return health_alert.id
        
    except Exception as e:
        print(f"Error in trigger_emergency_alert: {str(e)}")
        return None

@shared_task
def send_emergency_notifications(user_id, health_alert_id):
    """Send emergency notifications via Twilio WhatsApp"""
    try:
        from twilio.rest import Client
        
        user = User.objects.get(id=user_id)
        health_alert = HealthAlert.objects.get(id=health_alert_id)
        
        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            print("Twilio credentials not configured - skipping WhatsApp notifications")
            return
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Get emergency contacts
        emergency_contacts = user.emergency_contacts.filter(is_active=True).order_by('priority')
        
        message_body = f"""
🚨 EMERGENCY ALERT 🚨

Patient: {user.first_name} {user.last_name}
Alert: {health_alert.title}
Details: {health_alert.message}
Time: {health_alert.created_at.strftime('%Y-%m-%d %H:%M:%S')}

This is an automated message from CardioCare AI monitoring system.
        """
        
        for contact in emergency_contacts:
            try:
                message = client.messages.create(
                    body=message_body,
                    from_='whatsapp:+14155238886',  # Twilio WhatsApp number
                    to=f'whatsapp:{contact.phone}'
                )
                print(f"WhatsApp sent to {contact.name}: {message.sid}")
            except Exception as e:
                print(f"Failed to send WhatsApp to {contact.name}: {str(e)}")
        
        # Mark contacts as notified
        health_alert.contacts_notified = True
        health_alert.save()
        
    except Exception as e:
        print(f"Error in send_emergency_notifications: {str(e)}")
