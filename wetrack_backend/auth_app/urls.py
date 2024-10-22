from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserDetailView

urlpatterns = [
    path('', include('dj_rest_auth.urls')),  # This includes login and logout
    path('registration/', include('dj_rest_auth.registration.urls')),

    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/me/', UserDetailView.as_view(), name='user-me'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]