from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import EmergencyResponse
from health_monitoring.tasks import trigger_emergency_alert
from accounts.models import EmergencyContact

@api_view(['POST'])
def trigger_emergency(request):
    """Trigger emergency alert"""
    user = request.user
    emergency_type = request.data.get('emergency_type', 'cardiac_emergency')
    patient_data = request.data.get('patient_data', {})
    location = request.data.get('location', 'Unknown location')
    
    try:
        # Create emergency response record
        emergency_response = EmergencyResponse.objects.create(
            user=user,
            response_type='whatsapp',
            recipient='emergency_contacts',
            message=f"Emergency detected: {emergency_type}",
            status='pending'
        )
        
        # Trigger emergency alert
        trigger_emergency_alert.delay(user.id, None)
        
        return Response({
            'success': True,
            'emergency_id': emergency_response.id,
            'message': 'Emergency alert triggered successfully'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_emergency_contacts(request):
    """Get user's emergency contacts"""
    user = request.user
    contacts = EmergencyContact.objects.filter(user=user, is_active=True).order_by('priority')
    
    contact_data = []
    for contact in contacts:
        contact_data.append({
            'id': contact.id,
            'name': contact.name,
            'phone': contact.phone,
            'relationship': contact.relationship,
            'priority': contact.priority
        })
    
    return Response(contact_data)

@api_view(['POST'])
def update_emergency_contact(request, contact_id):
    """Update emergency contact"""
    try:
        contact = EmergencyContact.objects.get(id=contact_id, user=request.user)
        
        contact.name = request.data.get('name', contact.name)
        contact.phone = request.data.get('phone', contact.phone)
        contact.relationship = request.data.get('relationship', contact.relationship)
        contact.priority = request.data.get('priority', contact.priority)
        contact.save()
        
        return Response({
            'id': contact.id,
            'name': contact.name,
            'phone': contact.phone,
            'relationship': contact.relationship,
            'priority': contact.priority,
            'message': 'Contact updated successfully'
        })
        
    except EmergencyContact.DoesNotExist:
        return Response(
            {'error': 'Contact not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def add_emergency_contact(request):
    """Add new emergency contact"""
    try:
        contact = EmergencyContact.objects.create(
            user=request.user,
            name=request.data.get('name'),
            phone=request.data.get('phone'),
            relationship=request.data.get('relationship'),
            priority=request.data.get('priority', 5)
        )
        
        return Response({
            'id': contact.id,
            'name': contact.name,
            'phone': contact.phone,
            'relationship': contact.relationship,
            'priority': contact.priority,
            'message': 'Contact added successfully'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
