from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'foreign_currency', 'converted_amount', 'home_currency', 'exchange_rate', 'transaction_date']
