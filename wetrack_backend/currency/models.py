# currency/models.py
from django.db import models
from django.utils import timezone
from django.conf import settings

class CurrencyConversion(models.Model):
    from_currency = models.CharField(max_length=3)
    to_currency = models.CharField(max_length=3)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    converted_amount = models.DecimalField(max_digits=10, decimal_places=2)
    rate = models.DecimalField(max_digits=10, decimal_places=6)
    timestamp = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Changed from 'auth.User' to settings.AUTH_USER_MODEL
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['from_currency', 'to_currency']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f"{self.amount} {self.from_currency} to {self.to_currency}"

class ExchangeRate(models.Model):
    base_currency = models.CharField(max_length=3)
    target_currency = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=10, decimal_places=6)
    last_updated = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('base_currency', 'target_currency')
        indexes = [
            models.Index(fields=['base_currency', 'target_currency']),
            models.Index(fields=['last_updated']),
        ]

    def __str__(self):
        return f"{self.base_currency}/{self.target_currency}: {self.rate}"