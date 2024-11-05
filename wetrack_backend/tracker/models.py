# models.py
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Category(models.Model):
    CATEGORY_CHOICES = [
        ('FOOD', 'Food'),
        ('PURCHASE', 'Purchase'),
        ('FIXED', 'Fixed Cost'),
        ('TRAVEL', 'Travel'),
    ]

    name = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories'
    )

    class Meta:
        unique_together = ['name', 'user']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class FixedCost(models.Model):
    FREQUENCY_CHOICES = [
        ('MONTHLY', 'Monthly'),
        ('WEEKLY', 'Weekly'),
        ('YEARLY', 'Yearly'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fixed_costs'
    )
    name = models.CharField(max_length=100)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    next_due_date = models.DateField()

    def __str__(self):
        return f"{self.name} - {self.frequency}"

class Expense(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    description = models.CharField(max_length=200)
    date = models.DateField(auto_now_add=True)
    fixed_cost = models.ForeignKey(
        FixedCost,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='expenses'
    )

    def __str__(self):
        return f"{self.user.username} - {self.category.name} - {self.amount}"

    class Meta:
        ordering = ['-date']  # Most recent expenses first