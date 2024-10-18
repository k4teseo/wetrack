import requests
from django.conf import settings

FIXER_API_URL = "http://data.fixer.io/api/latest"

def get_exchange_rate(base_currency, target_currency):
    params = {
        'access_key': settings.FIXER_API_KEY,  # Accessing the API key from settings
        'base': base_currency,
        'symbols': target_currency
    }
    response = requests.get(FIXER_API_URL, params=params)
    data = response.json()

    if response.status_code != 200 or not data.get('success', False):
        raise Exception("Error fetching exchange rate")

    return data['rates'][target_currency]
