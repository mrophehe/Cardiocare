from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.conf import settings
import requests
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def google_fit_auth(request):
    """Initialize Google Fit OAuth flow"""
    try:
        from google_auth_oauthlib.flow import Flow
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost:3000/auth/google/callback"]
                }
            },
            scopes=[
                'https://www.googleapis.com/auth/fitness.heart_rate.read',
                'https://www.googleapis.com/auth/fitness.blood_pressure.read',
                'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
                'https://www.googleapis.com/auth/fitness.body_temperature.read',
                'openid',
                'email',
                'profile'
            ]
        )
        flow.redirect_uri = "http://localhost:3000/auth/google/callback"
        
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        
        return Response({
            'authorization_url': authorization_url,
            'state': state
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def google_fit_callback(request):
    """Handle Google Fit OAuth callback"""
    try:
        from google_auth_oauthlib.flow import Flow
        from .models import User
        
        code = request.data.get('code')
        state = request.data.get('state')
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost:3000/auth/google/callback"]
                }
            },
            scopes=[
                'https://www.googleapis.com/auth/fitness.heart_rate.read',
                'https://www.googleapis.com/auth/fitness.blood_pressure.read',
                'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
                'https://www.googleapis.com/auth/fitness.body_temperature.read',
                'openid',
                'email',
                'profile'
            ],
            state=state
        )
        flow.redirect_uri = "http://localhost:3000/auth/google/callback"
        
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Get user info
        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {credentials.token}'}
        )
        user_info = user_info_response.json()
        
        # Create or get user
        user, created = User.objects.get_or_create(
            email=user_info['email'],
            defaults={
                'username': user_info['email'],
                'first_name': user_info.get('given_name', ''),
                'last_name': user_info.get('family_name', ''),
                'provider': 'google_fit',
                'provider_id': user_info['id'],
            }
        )
        
        # Update tokens
        user.access_token = credentials.token
        user.refresh_token = credentials.refresh_token
        user.token_expires_at = credentials.expiry
        user.save()
        
        return Response({
            'user_id': user.id,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}",
            'provider': 'google_fit',
            'access_token': credentials.token
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def apple_health_auth(request):
    """Initialize Apple Health authentication"""
    return Response({
        'message': 'Apple Health authentication requires iOS app with HealthKit integration',
        'redirect_url': 'cardiocare://auth/apple'
    })

@api_view(['GET'])
def user_profile(request):
    """Get current user profile"""
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'name': f"{user.first_name} {user.last_name}",
        'provider': user.provider,
        'emergency_settings': {
            'auto_call': user.emergency_auto_call,
            'whatsapp': user.emergency_whatsapp,
            'ai_voice': user.emergency_ai_voice,
        }
    })
