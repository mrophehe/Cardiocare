from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.utils import timezone
import requests
import json
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_fit_auth(request):
    """Initialize Google Fit OAuth flow"""
    try:
        from google_auth_oauthlib.flow import Flow
        
        if not settings.GOOGLE_OAUTH2_CLIENT_ID or not settings.GOOGLE_OAUTH2_CLIENT_SECRET:
            return Response(
                {'error': 'Google OAuth credentials not configured'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [f"{settings.CORS_ALLOWED_ORIGINS[0]}/auth/google/callback"]
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
        flow.redirect_uri = f"{settings.CORS_ALLOWED_ORIGINS[0]}/auth/google/callback"
        
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        
        logger.info(f"Generated Google OAuth URL for user")
        
        return Response({
            'authorization_url': authorization_url,
            'state': state
        })
    except Exception as e:
        logger.error(f"Error in google_fit_auth: {str(e)}")
        return Response(
            {'error': 'Failed to initialize Google Fit authentication'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
        
        if not code:
            return Response(
                {'error': 'Authorization code not provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [f"{settings.CORS_ALLOWED_ORIGINS[0]}/auth/google/callback"]
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
        flow.redirect_uri = f"{settings.CORS_ALLOWED_ORIGINS[0]}/auth/google/callback"
        
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Get user info
        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {credentials.token}'}
        )
        
        if user_info_response.status_code != 200:
            return Response(
                {'error': 'Failed to get user information from Google'}, 
                status=status.HTTP_400_BAD_REQUEST
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
        
        logger.info(f"User {user.email} authenticated successfully with Google Fit")
        
        return Response({
            'user_id': user.id,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}",
            'provider': 'google_fit',
            'access_token': credentials.token
        })
        
    except Exception as e:
        logger.error(f"Error in google_fit_callback: {str(e)}")
        return Response(
            {'error': 'Authentication failed'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def apple_health_auth(request):
    """Initialize Apple Health authentication"""
    return Response({
        'message': 'Apple Health authentication requires iOS app with HealthKit integration',
        'redirect_url': 'cardiocare://auth/apple',
        'status': 'ios_required'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
        },
        'created_at': user.created_at.isoformat(),
        'last_login': user.last_login.isoformat() if user.last_login else None
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for deployment"""
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'version': '1.0.0'
    })
