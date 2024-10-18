from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Transaction
from .serializers import TransactionSerializer
from .services import get_exchange_rate

@api_view(['POST'])
def convert_currency(request):
    user = request.user
    amount = request.data.get('amount')
    foreign_currency = request.data.get('foreign_currency')
    home_currency = request.data.get('home_currency')

    # Fetch the exchange rate
    try:
        exchange_rate = get_exchange_rate(foreign_currency, home_currency)
        converted_amount = float(amount) * exchange_rate
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    # Create the transaction
    transaction = Transaction.objects.create(
        user=user,
        amount=amount,
        foreign_currency=foreign_currency,
        converted_amount=converted_amount,
        home_currency=home_currency,
        exchange_rate=exchange_rate
    )

    serializer = TransactionSerializer(transaction)
    return Response(serializer.data)
