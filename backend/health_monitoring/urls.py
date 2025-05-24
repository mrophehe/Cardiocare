from django.urls import path
from . import views

urlpatterns = [
    path('current-metrics/', views.get_current_health_metrics, name='current_metrics'),
    path('ecg/submit/', views.submit_ecg_data, name='submit_ecg_data'),
    path('analysis/', views.get_ai_analysis, name='get_ai_analysis'),
    path('sync/google-fit/', views.sync_google_fit_data, name='sync_google_fit'),
    path('alerts/', views.get_health_alerts, name='get_health_alerts'),
]
