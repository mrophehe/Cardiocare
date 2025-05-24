from django.urls import path
from . import views

urlpatterns = [
    path('google-fit/', views.google_fit_auth, name='google_fit_auth'),
    path('google-fit/callback/', views.google_fit_callback, name='google_fit_callback'),
    path('apple-health/', views.apple_health_auth, name='apple_health_auth'),
    path('profile/', views.user_profile, name='user_profile'),
    path('health/', views.health_check, name='health_check'),
]
