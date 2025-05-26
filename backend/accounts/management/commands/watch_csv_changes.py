import os
import time
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from django.core.management.base import BaseCommand
from django.core.management import call_command

class CSVFileHandler(FileSystemEventHandler):
    def __init__(self, command_instance):
        self.command_instance = command_instance
        self.last_reload = 0
        self.reload_delay = 2  # Wait 2 seconds before reloading to avoid multiple triggers

    def on_modified(self, event):
        if event.is_directory:
            return
        
        if event.src_path.endswith('.csv'):
            current_time = time.time()
            if current_time - self.last_reload > self.reload_delay:
                self.last_reload = current_time
                self.command_instance.stdout.write(
                    f"CSV file changed: {event.src_path}"
                )
                # Reload data with sync mode
                threading.Timer(1.0, self.reload_data).start()

    def reload_data(self):
        try:
            self.command_instance.stdout.write("Reloading data from CSV files...")
            call_command('load_mock_data', '--sync-mode')
            self.command_instance.stdout.write(
                self.command_instance.style.SUCCESS("Data reloaded successfully!")
            )
        except Exception as e:
            self.command_instance.stdout.write(
                self.command_instance.style.ERROR(f"Error reloading data: {str(e)}")
            )

class Command(BaseCommand):
    help = 'Watch CSV files for changes and automatically reload data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--data-dir',
            type=str,
            default='mock-data',
            help='Directory containing CSV files to watch'
        )

    def handle(self, *args, **options):
        data_dir = options['data_dir']
        
        if not os.path.exists(data_dir):
            self.stdout.write(
                self.style.ERROR(f"Directory not found: {data_dir}")
            )
            return

        self.stdout.write(f"Watching CSV files in: {data_dir}")
        self.stdout.write("Press Ctrl+C to stop watching...")

        # Initial load
        call_command('load_mock_data', '--sync-mode', '--data-dir', data_dir)

        # Set up file watcher
        event_handler = CSVFileHandler(self)
        observer = Observer()
        observer.schedule(event_handler, data_dir, recursive=False)
        observer.start()

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
            self.stdout.write("\nStopping CSV file watcher...")
        
        observer.join()
        self.stdout.write("CSV file watcher stopped.")
