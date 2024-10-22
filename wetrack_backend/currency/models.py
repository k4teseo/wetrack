from django.db import models

# Create  models here.
from django.db import models
from django.contrib.auth.models import User

class ExchangeRate(models.Model):
    base_currency = models.CharField(max_length=3)
    target_currency = models.CharField(max_length=3)
    exchange_rate = models.FloatField()
    date_fetched = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.base_currency} to {self.target_currency} @ {self.exchange_rate}"

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()  # Amount spent in the foreign currency
    foreign_currency = models.CharField(max_length=3)  # Currency code
    converted_amount = models.FloatField()  # Amount converted to home currency
    home_currency = models.CharField(max_length=3)  # User's home currency code
    exchange_rate = models.FloatField()  # Rate used to convert
    transaction_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} spent {self.amount} {self.foreign_currency} converted to {self.converted_amount} {self.home_currency}"
