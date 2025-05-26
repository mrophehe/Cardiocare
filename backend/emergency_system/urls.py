from django.urls import path
from . import views

urlpatterns = [
    path('alert/', views.trigger_emergency, name='trigger_emergency'),
    path('contacts/', views.get_emergency_contacts, name='get_emergency_contacts'),
    path('contacts/add/', views.add_emergency_contact, name='add_emergency_contact'),
    path('contacts/<int:contact_id>/update/', views.update_emergency_contact, name='update_emergency_contact'),
]
