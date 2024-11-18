# tracker/models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ('1', 'Transportation'),
        ('2', 'Food & Drink'),
        ('3', 'Entertainment'),
        ('4', 'Bills & Utilities'),
        ('5', 'Retail Shopping'),
        ('6', 'Groceries'),
    ]

    CURRENCY_CHOICES = [
        ('GBP', 'British Pound'),
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Changed from django.contrib.auth.models.User
        on_delete=models.CASCADE,
        related_name='transactions'  # Added for easier querying
    )
    date = models.DateTimeField()
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    category = models.CharField(
        max_length=2,
        choices=CATEGORY_CHOICES
    )
    description = models.CharField(max_length=200)
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default='GBP'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"{self.user.username} - {self.amount} {self.currency} on {self.date}"