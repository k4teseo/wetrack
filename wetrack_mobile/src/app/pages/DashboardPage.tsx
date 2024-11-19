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
import useCurrencyConversion from '../../hooks/useCurrencyConversion';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../../config/api';

const screenWidth = Dimensions.get("window").width;

const CircularProgress = ({ percentage }) => {
  const radius = 70;
  const strokeWidth = 12; // Slightly reduced stroke width
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.circularProgressContainer}>
      <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        <Circle
          cx={radius + strokeWidth/2}
          cy={radius + strokeWidth/2}
          r={radius}
          stroke="#E8EDF1"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={radius + strokeWidth/2}
          cy={radius + strokeWidth/2}
          r={radius}
          stroke="#2196F3"
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
          fontSize="32"
          fontWeight="bold"
        >
          {percentage.toFixed(1)}
        </SvgText>
        <SvgText
          x={radius + strokeWidth/2}
          y={radius + strokeWidth/2 + 24}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="#666"
          fontSize="16"
        >
          %
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
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState({});
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const { convertCurrency, isLoading: conversionLoading } = useCurrencyConversion();
  const [spendingData, setSpendingData] = useState({
    totalSpent: 0,
    categoryBreakdown: {},
    spentPercentage: 0
  });

  const fetchCurrencies = async () => {
    try {
      console.log('Fetching currencies from:', `${API_URL}/api/currency/currencies/`);
      const response = await axios.get(`${API_URL}/api/currency/currencies/`);
      console.log('Response:', response.data);

      if (response.data && response.data.currencies) {
        setAvailableCurrencies(response.data.currencies);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Fetch error:', {
        message: error.message,
        response: error.response?.data,
        url: error.config?.url
      });
    } finally {
      setLoadingCurrencies(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    if (!amount) return;
    try {
      const response = await convertCurrency(amount, fromCurrency, toCurrency);
      setResult(response.result);
    } catch (error) {
      console.error(error);
    }
  };

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userData?.username || "User"}!</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Currency Converter Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Convert</Text>

          {/* Top Currency Input */}
          <View style={styles.converterInputContainer}>
            <TextInput
              style={styles.converterInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              keyboardType="numeric"
              onSubmitEditing={handleConvert}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fromCurrency}
                style={styles.currencyPicker}
                onValueChange={(itemValue) => {
                  setFromCurrency(itemValue);
                  handleConvert();
                }}>
                {Object.entries(availableCurrencies).map(([code, name]) => (
                  <Picker.Item key={code} label={`${code} - ${name}`} value={code} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Bottom Currency Input */}
          <View style={styles.converterInputContainer}>
            <Text style={styles.converterResult}>
              {result ? result.toFixed(2) : '0.00'}
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={toCurrency}
                style={styles.currencyPicker}
                onValueChange={(itemValue) => {
                  setToCurrency(itemValue);
                  handleConvert();
                }}>
                {Object.entries(availableCurrencies).map(([code, name]) => (
                  <Picker.Item key={code} label={`${code} - ${name}`} value={code} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Spending Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Summary</Text>
          <CircularProgress percentage={spendingData.spentPercentage} />
          <View style={styles.budgetDetails}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Budget</Text>
              <Text style={styles.budgetAmount}>
                £{monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.budgetRow}>
              <Text style={styles.spentLabel}>Spent</Text>
              <Text style={styles.spentAmount}>
                £{spendingData.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.budgetRow}>
              <Text style={styles.remainingLabel}>Remaining</Text>
              <Text style={styles.remainingAmount}>
                £{Math.max(0, monthlyBudget - spendingData.totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          {Object.entries(spendingData.categoryBreakdown).map(([category, amount], index) => (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryAmount}>
                  £{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(amount / spendingData.totalSpent) * 100}%`,
                      backgroundColor: [
                        '#2196F3',
                        '#4CAF50',
                        '#FF9800',
                        '#9C27B0',
                        '#F44336'
                      ][index % 5]
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  dateText: {
    fontSize: 14,
    marginRight: 4,
    color: "#1A1A1A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  converterInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  converterInput: {
    flex: 1,
    fontSize: 24,
    color: "#1A1A1A",
  },
  converterResult: {
    flex: 1,
    fontSize: 24,
    color: "#1A1A1A",
  },
  pickerContainer: {
    width: 120,
  },
  currencyPicker: {
    width: "100%",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginVertical: 8,
  },
  circularProgressContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  budgetDetails: {
    marginTop: 16,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  budgetLabel: {
    color: "#666666",
  },
  budgetAmount: {
    fontWeight: "600",
    color: "#1A1A1A",
  },
  spentLabel: {
    color: "#666666",
  },
  spentAmount: {
    fontWeight: "600",
    color: "#F44336",
  },
  remainingLabel: {
    color: "#666666",
  },
  remainingAmount: {
    fontWeight: "600",
    color: "#4CAF50",
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryName: {
    color: "#666666",
  },
  categoryAmount: {
    fontWeight: "600",
    color: "#1A1A1A",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#F5F7FA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default DashboardPage;