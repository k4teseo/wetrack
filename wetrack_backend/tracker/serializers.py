from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'date', 'amount', 'category', 'category_display',
                 'description', 'currency', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']