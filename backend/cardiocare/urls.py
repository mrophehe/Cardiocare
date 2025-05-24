from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/health/', include('health_monitoring.urls')),
    path('api/emergency/', include('emergency_system.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]
