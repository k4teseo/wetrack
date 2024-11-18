# currency/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
import os
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

@api_view(['GET'])
def convert_currency(request):
    """Convert currency using FastForex API"""
    try:
        amount = request.GET.get('amount')
        from_currency = request.GET.get('from', 'GBP')
        to_currency = request.GET.get('to', 'USD')

        if not amount:
            return Response(
                {'error': 'Amount is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)
        except ValueError:
            return Response(
                {'error': 'Invalid amount format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.getenv('CURR_API')
        url = 'https://api.fastforex.io/convert'

        params = {
            'from': from_currency,
            'to': to_currency,
            'amount': str(amount),
            'api_key': api_key
        }

        logger.info(f"Making request to FastForex: {url}")

        response = requests.get(url, params=params)
        data = response.json()

        logger.info(f"FastForex response: {data}")  # Log the response

        if response.status_code == 200:
            # Extract the result and rate from the response
            if 'result' in data and to_currency in data['result']:
                result = float(data['result'][to_currency])
                # The rate can be calculated from the result and amount
                rate = result / amount if amount != 0 else 0

                return Response({
                    'amount': amount,
                    'from': from_currency,
                    'to': to_currency,
                    'rate': rate,
                    'result': result
                })
            else:
                logger.error(f"Unexpected response format: {data}")
                return Response(
                    {'error': 'Invalid response format from currency service'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            error_message = data.get('message', data.get('error', 'Currency conversion failed'))
            logger.error(f"FastForex API error: {error_message}")
            return Response(
                {'error': error_message},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    except Exception as e:
        logger.error(f"Currency conversion error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_available_currencies(request):
    """Fetch available currencies from FastForex"""
    try:
        api_key = os.getenv('CURR_API')
        url = 'https://api.fastforex.io/currencies'
        params = {
            'api_key': api_key
        }

        response = requests.get(url, params=params)
        data = response.json()

        if response.status_code == 200:
            return Response({
                'currencies': data.get('currencies', {})
            })
        else:
            logger.error(f"FastForex API error: {data}")
            return Response(
                {'error': data.get('message', 'Failed to fetch currencies')},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    except Exception as e:
        logger.error(f"Currency fetch error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_exchange_rate(request):
    """Get exchange rate between two currencies"""
    try:
        from_currency = request.GET.get('from', 'GBP')
        to_currency = request.GET.get('to', 'USD')

        api_key = os.getenv('CURR_API')
        url = 'https://api.fastforex.io/fetch-one'

        params = {
            'from': from_currency,
            'to': to_currency,
            'api_key': api_key
        }

        response = requests.get(url, params=params)
        data = response.json()

        if response.status_code == 200 and 'result' in data:
            rate = float(data['result'][to_currency])
            return Response({
                'from': from_currency,
                'to': to_currency,
                'rate': rate
            })
        else:
            logger.error(f"FastForex API error: {data}")
            return Response(
                {'error': data.get('message', 'Failed to fetch exchange rate')},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    except Exception as e:
        logger.error(f"Exchange rate error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )