from django.urls import path
from . import views

urlpatterns = [
    path('alert/', views.trigger_emergency, name='trigger_emergency'),
    path('contacts/', views.get_emergency_contacts, name='get_emergency_contacts'),
]
