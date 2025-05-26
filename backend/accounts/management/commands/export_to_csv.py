import csv
import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from accounts.models import User, EmergencyContact
from health_monitoring.models import HealthData, ECGReading, AIAnalysis, HealthAlert, HealthHistoryMessage
from emergency_system.models import EmergencyResponse

class Command(BaseCommand):
    help = 'Export current database data to CSV files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output-dir',
            type=str,
            default='exported-data',
            help='Directory to save CSV files'
        )

    def handle(self, *args, **options):
        output_dir = options['output_dir']
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Export all data
        self.export_users(output_dir)
        self.export_emergency_contacts(output_dir)
        self.export_health_data(output_dir)
        self.export_ecg_readings(output_dir)
        self.export_ai_analyses(output_dir)
        self.export_health_alerts(output_dir)
        self.export_emergency_responses(output_dir)
        self.export_health_history_messages(output_dir)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully exported all data to {output_dir}')
        )

    def export_users(self, output_dir):
        file_path = os.path.join(output_dir, 'users.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'email', 'name', 'first_name', 'last_name', 'provider', 
                'provider_id', 'date_of_birth', 'gender', 'height', 'weight',
                'emergency_auto_call', 'emergency_whatsapp', 'emergency_ai_voice', 'created_at'
            ])
            
            for user in User.objects.all():
                writer.writerow([
                    user.id,
                    user.email,
                    f"{user.first_name} {user.last_name}",
                    user.first_name,
                    user.last_name,
                    user.provider or '',
                    user.provider_id or '',
                    user.date_of_birth.isoformat() if user.date_of_birth else '',
                    user.gender or '',
                    user.height or '',
                    user.weight or '',
                    user.emergency_auto_call,
                    user.emergency_whatsapp,
                    user.emergency_ai_voice,
                    user.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported users to {file_path}")

    def export_emergency_contacts(self, output_dir):
        file_path = os.path.join(output_dir, 'emergency_contacts.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'name', 'phone', 'relationship', 
                'priority', 'is_active', 'created_at'
            ])
            
            for contact in EmergencyContact.objects.all():
                writer.writerow([
                    contact.id,
                    contact.user.id,
                    contact.name,
                    contact.phone,
                    contact.relationship,
                    contact.priority,
                    contact.is_active,
                    contact.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported emergency contacts to {file_path}")

    def export_health_data(self, output_dir):
        file_path = os.path.join(output_dir, 'health_data.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'data_type', 'value', 'unit', 
                'source', 'recorded_at', 'created_at'
            ])
            
            for data in HealthData.objects.all():
                writer.writerow([
                    data.id,
                    data.user.id,
                    data.data_type,
                    json.dumps(data.value),
                    data.unit,
                    data.source,
                    data.recorded_at.isoformat(),
                    data.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported health data to {file_path}")

    def export_ecg_readings(self, output_dir):
        file_path = os.path.join(output_dir, 'ecg_readings.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'waveform_data', 'heart_rate', 'duration',
                'quality_score', 'anomalies_detected', 'recorded_at', 'created_at'
            ])
            
            for reading in ECGReading.objects.all():
                writer.writerow([
                    reading.id,
                    reading.user.id,
                    json.dumps(reading.waveform_data),
                    reading.heart_rate,
                    reading.duration,
                    reading.quality_score,
                    json.dumps(reading.anomalies_detected),
                    reading.recorded_at.isoformat(),
                    reading.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported ECG readings to {file_path}")

    def export_ai_analyses(self, output_dir):
        file_path = os.path.join(output_dir, 'ai_analyses.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'health_data', 'risk_level', 'analysis_result',
                'prediction', 'confidence_score', 'recommendations', 'time_to_emergency', 'created_at'
            ])
            
            for analysis in AIAnalysis.objects.all():
                writer.writerow([
                    analysis.id,
                    analysis.user.id,
                    json.dumps(analysis.health_data),
                    analysis.risk_level,
                    analysis.analysis_result,
                    analysis.prediction,
                    analysis.confidence_score,
                    json.dumps(analysis.recommendations),
                    analysis.time_to_emergency or 'null',
                    analysis.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported AI analyses to {file_path}")

    def export_health_alerts(self, output_dir):
        file_path = os.path.join(output_dir, 'health_alerts.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'alert_type', 'title', 'message', 'status',
                'severity', 'ai_analysis_id', 'emergency_call_initiated', 
                'contacts_notified', 'created_at', 'resolved_at'
            ])
            
            for alert in HealthAlert.objects.all():
                writer.writerow([
                    alert.id,
                    alert.user.id,
                    alert.alert_type,
                    alert.title,
                    alert.message,
                    alert.status,
                    alert.severity,
                    alert.ai_analysis.id if alert.ai_analysis else 'null',
                    alert.emergency_call_initiated,
                    alert.contacts_notified,
                    alert.created_at.isoformat(),
                    alert.resolved_at.isoformat() if alert.resolved_at else 'null'
                ])
        
        self.stdout.write(f"Exported health alerts to {file_path}")

    def export_emergency_responses(self, output_dir):
        file_path = os.path.join(output_dir, 'emergency_responses.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'response_type', 'recipient', 'message',
                'status', 'external_id', 'sent_at', 'delivered_at', 'created_at'
            ])
            
            for response in EmergencyResponse.objects.all():
                writer.writerow([
                    response.id,
                    response.user.id,
                    response.response_type,
                    response.recipient,
                    response.message,
                    response.status,
                    response.external_id or '',
                    response.sent_at.isoformat() if response.sent_at else 'null',
                    response.delivered_at.isoformat() if response.delivered_at else 'null',
                    response.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported emergency responses to {file_path}")

    def export_health_history_messages(self, output_dir):
        file_path = os.path.join(output_dir, 'health_history_messages.csv')
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'id', 'user_id', 'message_type', 'content', 'attachments',
                'timestamp', 'created_at'
            ])
            
            for message in HealthHistoryMessage.objects.all():
                writer.writerow([
                    message.id,
                    message.user.id,
                    message.message_type,
                    message.content,
                    json.dumps(message.attachments),
                    message.timestamp.isoformat(),
                    message.created_at.isoformat()
                ])
        
        self.stdout.write(f"Exported health history messages to {file_path}")
