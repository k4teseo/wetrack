# auth_app/serializers.py
from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)  # Add this field

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'name', 'password1', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False},
        }

    def create(self, validated_data):
        name = validated_data.pop('name', '')  # Get the name
        user = CustomUser.objects.create_user(**validated_data)
        user.first_name = name  # Store the name in first_name field
        user.save()
        return user