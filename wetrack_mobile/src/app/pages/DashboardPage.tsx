import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../../services/authService";
import Icon from "react-native-vector-icons/Ionicons";
import { useTransactions } from '../../context/TransactionContext';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const screenWidth = Dimensions.get("window").width;

const CircularProgress = ({ percentage }) => {
  const radius = 70;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.circularProgressContainer}>
      <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        <Circle
          cx={radius + strokeWidth/2}
          cy={radius + strokeWidth/2}
          r={radius}
          stroke="#3d5875"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={radius + strokeWidth/2}
          cy={radius + strokeWidth/2}
          r={radius}
          stroke="#00e0ff"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth/2} ${radius + strokeWidth/2})`}
        />
        <SvgText
          x={radius + strokeWidth/2}
          y={radius + strokeWidth/2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="#333"
          fontSize="24"
          fontWeight="bold"
        >
          {percentage.toFixed(1)}%
        </SvgText>
      </Svg>
    </View>
  );
};

const DashboardPage = () => {
  const navigation = useNavigation();
  const { transactions, fetchTransactions } = useTransactions();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [spendingData, setSpendingData] = useState({
    totalSpent: 0,
    categoryBreakdown: {},
    spentPercentage: 0
  });

  // Load user data and fetch transactions
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          return;
        }

        // Reset spending data
        setSpendingData({
          totalSpent: 0,
          categoryBreakdown: {},
          spentPercentage: 0
        });

        // Fetch fresh user data
        const freshUserData = await AuthService.getUserProfile();
        if (freshUserData && isMounted) {
          setUserData(freshUserData);
          await AsyncStorage.setItem("user", JSON.stringify(freshUserData));
        }

        // Fetch fresh transactions
        await fetchTransactions();
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        if (isMounted) {
          Alert.alert("Error", "Failed to load dashboard data. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  // Load budget and calculate spending when transactions or month changes
  useEffect(() => {
    const loadBudgetAndCalculateSpending = async () => {
      try {
        const userId = userData?.id;
        if (!userId) return;

        const savedBudget = await AsyncStorage.getItem(`budget_${userId}_${currentMonth}`);
        const budget = savedBudget ? parseFloat(savedBudget) : 0;
        setMonthlyBudget(budget);
        calculateSpendingData(budget);
      } catch (error) {
        console.error('Error loading budget:', error);
      }
    };

    loadBudgetAndCalculateSpending();
  }, [currentMonth, transactions, userData]);

  const calculateSpendingData = (budget) => {
    if (!transactions?.length) {
      setSpendingData({
        totalSpent: 0,
        categoryBreakdown: {},
        spentPercentage: 0
      });
      return;
    }

    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      return transactionMonth === currentMonth;
    });

    const totalSpent = monthlyTransactions.reduce((sum, transaction) => {
      return sum + Math.abs(parseFloat(transaction.amount));
    }, 0);

    const categoryBreakdown = monthlyTransactions.reduce((acc, transaction) => {
      const category = transaction.category_display;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(parseFloat(transaction.amount));
      return acc;
    }, {});

    const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

    setSpendingData({
      totalSpent,
      categoryBreakdown,
      spentPercentage: Math.min(spentPercentage, 100)
    });
  };

  const renderCategoryBreakdown = () => {
    return Object.entries(spendingData.categoryBreakdown).map(([category, amount], index) => (
      <View key={index} style={styles.categoryItem}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.categoryAmount}>
            £{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${(amount / spendingData.totalSpent) * 100}%`,
                backgroundColor: getCategoryColor(index)
              }
            ]}
          />
        </View>
      </View>
    ));
  };

  const getCategoryColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userData?.username || "Name"}!</Text>
          <TouchableOpacity style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <Icon name="chevron-down-outline" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.spendingSummaryCard]}>
          <Text style={styles.cardTitle}>Spending Summary</Text>
          <CircularProgress percentage={spendingData.spentPercentage} />
          <View style={styles.budgetDetails}>
            <Text style={styles.budgetText}>
              Budget: £{monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={styles.spentText}>
              Spent: £{spendingData.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={styles.remainingText}>
              Remaining: £{Math.max(0, monthlyBudget - spendingData.totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.categoryBreakdownCard]}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          {renderCategoryBreakdown()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginRight: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  budgetDetails: {
    marginTop: 20,
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  spentText: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 8,
  },
  remainingText: {
    fontSize: 16,
    color: "#388e3c",
  },
  categoryBreakdownCard: {
    marginTop: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: "#333",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default DashboardPage;