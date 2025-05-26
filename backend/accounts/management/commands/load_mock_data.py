import csv
import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction
from accounts.models import User, EmergencyContact
from health_monitoring.models import HealthData, ECGReading, AIAnalysis, HealthAlert, HealthHistoryMessage
from emergency_system.models import EmergencyResponse

class Command(BaseCommand):
    help = 'Load mock data from CSV files with dynamic updates'

    def add_arguments(self, parser):
        parser.add_argument(
            '--data-dir',
            type=str,
            default='mock-data',
            help='Directory containing CSV files'
        )
        parser.add_argument(
            '--clear-existing',
            action='store_true',
            help='Clear existing data before loading'
        )
        parser.add_argument(
            '--sync-mode',
            action='store_true',
            help='Sync mode: add new, update existing, remove deleted'
        )

    def handle(self, *args, **options):
        data_dir = options['data_dir']
        clear_existing = options['clear_existing']
        sync_mode = options['sync_mode']
        
        if clear_existing:
            self.clear_all_data()
        
        # Load data in order of dependencies
        with transaction.atomic():
            if sync_mode:
                self.sync_users(data_dir)
                self.sync_emergency_contacts(data_dir)
                self.sync_health_data(data_dir)
                self.sync_ecg_readings(data_dir)
                self.sync_ai_analyses(data_dir)
                self.sync_health_alerts(data_dir)
                self.sync_emergency_responses(data_dir)
                self.sync_health_history_messages(data_dir)
            else:
                self.load_users(data_dir)
                self.load_emergency_contacts(data_dir)
                self.load_health_data(data_dir)
                self.load_ecg_readings(data_dir)
                self.load_ai_analyses(data_dir)
                self.load_health_alerts(data_dir)
                self.load_emergency_responses(data_dir)
                self.load_health_history_messages(data_dir)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully loaded/synced all mock data')
        )

    def clear_all_data(self):
        """Clear all existing data"""
        self.stdout.write("Clearing existing data...")
        
        # Clear in reverse dependency order
        HealthHistoryMessage.objects.all().delete()
        EmergencyResponse.objects.all().delete()
        HealthAlert.objects.all().delete()
        AIAnalysis.objects.all().delete()
        ECGReading.objects.all().delete()
        HealthData.objects.all().delete()
        EmergencyContact.objects.all().delete()
        User.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS("Cleared all existing data"))

    def sync_users(self, data_dir):
        """Sync users with CSV data"""
        file_path = os.path.join(data_dir, 'users.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f"File not found: {file_path}")
            return

        csv_ids = set()
        
        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                user_id = int(row['id'])
                csv_ids.add(user_id)
                
                user_data = {
                    'email': row['email'],
                    'username': row['email'],
                    'first_name': row['first_name'],
                    'last_name': row['last_name'],
                    'provider': row['provider'],
                    'provider_id': row['provider_id'],
                    'date_of_birth': datetime.strptime(row['date_of_birth'], '%Y-%m-%d').date() if row['date_of_birth'] else None,
                    'gender': row['gender'],
                    'height': float(row['height']) if row['height'] else None,
                    'weight': float(row['weight']) if row['weight'] else None,
                    'emergency_auto_call': row['emergency_auto_call'].lower() == 'true',
                    'emergency_whatsapp': row['emergency_whatsapp'].lower() == 'true',
                    'emergency_ai_voice': row['emergency_ai_voice'].lower() == 'true',
                }
                
                user, created = User.objects.update_or_create(
                    id=user_id,
                    defaults=user_data
                )
                
                action = "Created" if created else "Updated"
                self.stdout.write(f"{action} user: {user.email}")

        # Remove users not in CSV
        existing_ids = set(User.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = User.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} users not in CSV")

    def sync_emergency_contacts(self, data_dir):
        """Sync emergency contacts with CSV data"""
        file_path = os.path.join(data_dir, 'emergency_contacts.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                contact_id = int(row['id'])
                csv_ids.add(contact_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    contact_data = {
                        'user': user,
                        'name': row['name'],
                        'phone': row['phone'],
                        'relationship': row['relationship'],
                        'priority': int(row['priority']),
                        'is_active': row['is_active'].lower() == 'true',
                    }
                    
                    contact, created = EmergencyContact.objects.update_or_create(
                        id=contact_id,
                        defaults=contact_data
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} emergency contact: {contact.name}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for contact {row['name']}")

        # Remove contacts not in CSV
        existing_ids = set(EmergencyContact.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = EmergencyContact.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} emergency contacts not in CSV")

    def sync_health_data(self, data_dir):
        """Sync health data with CSV data"""
        file_path = os.path.join(data_dir, 'health_data.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                data_id = int(row['id'])
                csv_ids.add(data_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    health_data_obj = {
                        'user': user,
                        'data_type': row['data_type'],
                        'value': json.loads(row['value']),
                        'unit': row['unit'],
                        'source': row['source'],
                        'recorded_at': datetime.fromisoformat(row['recorded_at'].replace('Z', '+00:00')),
                    }
                    
                    health_data, created = HealthData.objects.update_or_create(
                        id=data_id,
                        defaults=health_data_obj
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} health data: {health_data.data_type} for {user.email}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for health data")

        # Remove health data not in CSV
        existing_ids = set(HealthData.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = HealthData.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} health data records not in CSV")

    def sync_ecg_readings(self, data_dir):
        """Sync ECG readings with CSV data"""
        file_path = os.path.join(data_dir, 'ecg_readings.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                reading_id = int(row['id'])
                csv_ids.add(reading_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    ecg_data = {
                        'user': user,
                        'waveform_data': json.loads(row['waveform_data']),
                        'heart_rate': int(row['heart_rate']),
                        'duration': int(row['duration']),
                        'quality_score': float(row['quality_score']),
                        'anomalies_detected': json.loads(row['anomalies_detected']),
                        'recorded_at': datetime.fromisoformat(row['recorded_at'].replace('Z', '+00:00')),
                    }
                    
                    ecg_reading, created = ECGReading.objects.update_or_create(
                        id=reading_id,
                        defaults=ecg_data
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} ECG reading for {user.email}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for ECG reading")

        # Remove ECG readings not in CSV
        existing_ids = set(ECGReading.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = ECGReading.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} ECG readings not in CSV")

    def sync_ai_analyses(self, data_dir):
        """Sync AI analyses with CSV data"""
        file_path = os.path.join(data_dir, 'ai_analyses.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                analysis_id = int(row['id'])
                csv_ids.add(analysis_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    analysis_data = {
                        'user': user,
                        'health_data': json.loads(row['health_data']),
                        'risk_level': row['risk_level'],
                        'analysis_result': row['analysis_result'],
                        'prediction': row['prediction'],
                        'confidence_score': float(row['confidence_score']),
                        'recommendations': json.loads(row['recommendations']),
                        'time_to_emergency': row['time_to_emergency'] if row['time_to_emergency'] != 'null' else None,
                    }
                    
                    ai_analysis, created = AIAnalysis.objects.update_or_create(
                        id=analysis_id,
                        defaults=analysis_data
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} AI analysis for {user.email}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for AI analysis")

        # Remove AI analyses not in CSV
        existing_ids = set(AIAnalysis.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = AIAnalysis.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} AI analyses not in CSV")

    def sync_health_alerts(self, data_dir):
        """Sync health alerts with CSV data"""
        file_path = os.path.join(data_dir, 'health_alerts.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                alert_id = int(row['id'])
                csv_ids.add(alert_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    ai_analysis = None
                    if row['ai_analysis_id'] and row['ai_analysis_id'] != 'null':
                        try:
                            ai_analysis = AIAnalysis.objects.get(id=int(row['ai_analysis_id']))
                        except AIAnalysis.DoesNotExist:
                            pass

                    alert_data = {
                        'user': user,
                        'alert_type': row['alert_type'],
                        'title': row['title'],
                        'message': row['message'],
                        'status': row['status'],
                        'severity': row['severity'],
                        'ai_analysis': ai_analysis,
                        'emergency_call_initiated': row['emergency_call_initiated'].lower() == 'true',
                        'contacts_notified': row['contacts_notified'].lower() == 'true',
                        'resolved_at': datetime.fromisoformat(row['resolved_at'].replace('Z', '+00:00')) if row['resolved_at'] and row['resolved_at'] != 'null' else None,
                    }
                    
                    health_alert, created = HealthAlert.objects.update_or_create(
                        id=alert_id,
                        defaults=alert_data
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} health alert: {health_alert.title} for {user.email}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for health alert")

        # Remove health alerts not in CSV
        existing_ids = set(HealthAlert.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = HealthAlert.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} health alerts not in CSV")

    def sync_emergency_responses(self, data_dir):
        """Sync emergency responses with CSV data"""
        file_path = os.path.join(data_dir, 'emergency_responses.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                response_id = int(row['id'])
                csv_ids.add(response_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    response_data = {
                        'user': user,
                        'response_type': row['response_type'],
                        'recipient': row['recipient'],
                        'message': row['message'],
                        'status': row['status'],
                        'external_id': row['external_id'],
                        'sent_at': datetime.fromisoformat(row['sent_at'].replace('Z', '+00:00')) if row['sent_at'] and row['sent_at'] != 'null' else None,
                        'delivered_at': datetime.fromisoformat(row['delivered_at'].replace('Z', '+00:00')) if row['delivered_at'] and row['delivered_at'] != 'null' else None,
                    }
                    
                    emergency_response, created = EmergencyResponse.objects.update_or_create(
                        id=response_id,
                        defaults=response_data
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} emergency response for {user.email}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for emergency response")

        # Remove emergency responses not in CSV
        existing_ids = set(EmergencyResponse.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = EmergencyResponse.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} emergency responses not in CSV")

    def sync_health_history_messages(self, data_dir):
        """Sync health history messages with CSV data"""
        file_path = os.path.join(data_dir, 'health_history_messages.csv')
        if not os.path.exists(file_path):
            return

        csv_ids = set()

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                message_id = int(row['id'])
                csv_ids.add(message_id)
                
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    message_data = {
                        'user': user,
                        'message_type': row['message_type'],
                        'content': row['content'],
                        'attachments': json.loads(row['attachments']),
                        'timestamp': datetime.fromisoformat(row['timestamp'].replace('Z', '+00:00')),
                    }
                    
                    message, created = HealthHistoryMessage.objects.update_or_create(
                        id=message_id,
                        defaults=message_data
                    )
                    
                    action = "Created" if created else "Updated"
                    self.stdout.write(f"{action} health history message for {user.email}")
                    
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for health history message")

        # Remove health history messages not in CSV
        existing_ids = set(HealthHistoryMessage.objects.values_list('id', flat=True))
        to_delete = existing_ids - csv_ids
        if to_delete:
            deleted_count = HealthHistoryMessage.objects.filter(id__in=to_delete).delete()[0]
            self.stdout.write(f"Deleted {deleted_count} health history messages not in CSV")

    # Keep the original load methods for backward compatibility
    def load_users(self, data_dir):
        """Load users from CSV (original method)"""
        file_path = os.path.join(data_dir, 'users.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f"File not found: {file_path}")
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                user, created = User.objects.get_or_create(
                    id=int(row['id']),
                    defaults={
                        'email': row['email'],
                        'username': row['email'],
                        'first_name': row['first_name'],
                        'last_name': row['last_name'],
                        'provider': row['provider'],
                        'provider_id': row['provider_id'],
                        'date_of_birth': datetime.strptime(row['date_of_birth'], '%Y-%m-%d').date() if row['date_of_birth'] else None,
                        'gender': row['gender'],
                        'height': float(row['height']) if row['height'] else None,
                        'weight': float(row['weight']) if row['weight'] else None,
                        'emergency_auto_call': row['emergency_auto_call'].lower() == 'true',
                        'emergency_whatsapp': row['emergency_whatsapp'].lower() == 'true',
                        'emergency_ai_voice': row['emergency_ai_voice'].lower() == 'true',
                    }
                )
                if created:
                    self.stdout.write(f"Created user: {user.email}")

    def load_emergency_contacts(self, data_dir):
        file_path = os.path.join(data_dir, 'emergency_contacts.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    contact, created = EmergencyContact.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'name': row['name'],
                            'phone': row['phone'],
                            'relationship': row['relationship'],
                            'priority': int(row['priority']),
                            'is_active': row['is_active'].lower() == 'true',
                        }
                    )
                    if created:
                        self.stdout.write(f"Created emergency contact: {contact.name}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for contact {row['name']}")

    def load_health_data(self, data_dir):
        file_path = os.path.join(data_dir, 'health_data.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    health_data, created = HealthData.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'data_type': row['data_type'],
                            'value': json.loads(row['value']),
                            'unit': row['unit'],
                            'source': row['source'],
                            'recorded_at': datetime.fromisoformat(row['recorded_at'].replace('Z', '+00:00')),
                        }
                    )
                    if created:
                        self.stdout.write(f"Created health data: {health_data.data_type} for {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for health data")

    def load_ecg_readings(self, data_dir):
        file_path = os.path.join(data_dir, 'ecg_readings.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    ecg_reading, created = ECGReading.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'waveform_data': json.loads(row['waveform_data']),
                            'heart_rate': int(row['heart_rate']),
                            'duration': int(row['duration']),
                            'quality_score': float(row['quality_score']),
                            'anomalies_detected': json.loads(row['anomalies_detected']),
                            'recorded_at': datetime.fromisoformat(row['recorded_at'].replace('Z', '+00:00')),
                        }
                    )
                    if created:
                        self.stdout.write(f"Created ECG reading for {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for ECG reading")

    def load_ai_analyses(self, data_dir):
        file_path = os.path.join(data_dir, 'ai_analyses.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    ai_analysis, created = AIAnalysis.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'health_data': json.loads(row['health_data']),
                            'risk_level': row['risk_level'],
                            'analysis_result': row['analysis_result'],
                            'prediction': row['prediction'],
                            'confidence_score': float(row['confidence_score']),
                            'recommendations': json.loads(row['recommendations']),
                            'time_to_emergency': row['time_to_emergency'] if row['time_to_emergency'] != 'null' else None,
                        }
                    )
                    if created:
                        self.stdout.write(f"Created AI analysis for {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for AI analysis")

    def load_health_alerts(self, data_dir):
        file_path = os.path.join(data_dir, 'health_alerts.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    ai_analysis = None
                    if row['ai_analysis_id'] and row['ai_analysis_id'] != 'null':
                        try:
                            ai_analysis = AIAnalysis.objects.get(id=int(row['ai_analysis_id']))
                        except AIAnalysis.DoesNotExist:
                            pass

                    health_alert, created = HealthAlert.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'alert_type': row['alert_type'],
                            'title': row['title'],
                            'message': row['message'],
                            'status': row['status'],
                            'severity': row['severity'],
                            'ai_analysis': ai_analysis,
                            'emergency_call_initiated': row['emergency_call_initiated'].lower() == 'true',
                            'contacts_notified': row['contacts_notified'].lower() == 'true',
                            'resolved_at': datetime.fromisoformat(row['resolved_at'].replace('Z', '+00:00')) if row['resolved_at'] and row['resolved_at'] != 'null' else None,
                        }
                    )
                    if created:
                        self.stdout.write(f"Created health alert: {health_alert.title} for {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for health alert")

    def load_emergency_responses(self, data_dir):
        file_path = os.path.join(data_dir, 'emergency_responses.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    emergency_response, created = EmergencyResponse.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'response_type': row['response_type'],
                            'recipient': row['recipient'],
                            'message': row['message'],
                            'status': row['status'],
                            'external_id': row['external_id'],
                            'sent_at': datetime.fromisoformat(row['sent_at'].replace('Z', '+00:00')) if row['sent_at'] and row['sent_at'] != 'null' else None,
                            'delivered_at': datetime.fromisoformat(row['delivered_at'].replace('Z', '+00:00')) if row['delivered_at'] and row['delivered_at'] != 'null' else None,
                        }
                    )
                    if created:
                        self.stdout.write(f"Created emergency response for {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for emergency response")

    def load_health_history_messages(self, data_dir):
        file_path = os.path.join(data_dir, 'health_history_messages.csv')
        if not os.path.exists(file_path):
            return

        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    user = User.objects.get(id=int(row['user_id']))
                    message, created = HealthHistoryMessage.objects.get_or_create(
                        id=int(row['id']),
                        defaults={
                            'user': user,
                            'message_type': row['message_type'],
                            'content': row['content'],
                            'attachments': json.loads(row['attachments']),
                            'timestamp': datetime.fromisoformat(row['timestamp'].replace('Z', '+00:00')),
                        }
                    )
                    if created:
                        self.stdout.write(f"Created health history message for {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"User {row['user_id']} not found for health history message")
