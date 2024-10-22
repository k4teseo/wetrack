from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import UserDetailView

urlpatterns = [
    # ...
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]