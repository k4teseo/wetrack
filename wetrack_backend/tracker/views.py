# views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from datetime import datetime, timedelta
from .models import Category, Expense, FixedCost
from .serializers import CategorySerializer, ExpenseSerializer, FixedCostSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FixedCostViewSet(viewsets.ModelViewSet):
    serializer_class = FixedCostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FixedCost.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        # Get date range from query params or default to current month
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)

        # Calculate total expenses by category
        expenses_by_category = (
            self.get_queryset()
            .filter(date__range=[start_date, end_date])
            .values('category__name')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        return Response({
            'total_expenses': sum(item['total'] for item in expenses_by_category),
            'by_category': expenses_by_category
        })
