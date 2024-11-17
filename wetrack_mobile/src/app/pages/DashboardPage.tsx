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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../../services/authService";
import { ProgressChart, BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Data for the Progress Chart
const progressData = {
  labels: ["Spent", "Available"],
  data: [0.7, 0.3],
};

// Data for the Bar Chart (Spending Breakdown)
const barChartData = {
  labels: ["Food", "Transport", "Entertainment", "Bills", "Misc"],
  datasets: [
    {
      data: [400, 200, 150, 300, 100],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
  barPercentage: 0.6,
};

const DashboardPage = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyFrom, setCurrencyFrom] = useState("");
  const [currencyTo, setCurrencyTo] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(""); // Added convertedAmount to state

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          return;
        }

        const cachedUser = await AsyncStorage.getItem("user");
        if (cachedUser) {
          setUserData(JSON.parse(cachedUser));
        }

        const freshUserData = await AuthService.getUserProfile();
        if (freshUserData) {
          setUserData(freshUserData);
          await AsyncStorage.setItem("user", JSON.stringify(freshUserData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        if (error.message.includes("token")) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        } else {
          Alert.alert(
            "Error",
            "Failed to load user data. Please try again later."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigation]);

  const handleConvert = () => {
    // Placeholder conversion logic; replace with actual conversion logic later
    if (!amount || !currencyFrom || !currencyTo) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const convertedValue = (parseFloat(amount) * 1.2).toFixed(2); // Example: converting with a rate of 1.2
    setConvertedAmount(convertedValue);
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
          <Text style={styles.greeting}>
            Hi, {userData?.username || "Name"}!
          </Text>
          <TouchableOpacity style={styles.dateContainer}>
            <Text style={styles.dateText}>October 2024</Text>
            <Icon name="chevron-down-outline" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Currency Conversion */}
        <View style={[styles.card, styles.currencyConversionCard]}>
          <Text style={styles.cardTitle}>Currency Conversion</Text>
          <View style={styles.currencyConversionRow}>
            <TextInput
              style={[styles.currencyInput, styles.currencyBox]}
              placeholder="Amount"
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
            />
            <TextInput
              style={[styles.currencyInput, styles.currencyBox]}
              placeholder="From Currency (e.g., USD)"
              value={currencyFrom}
              onChangeText={setCurrencyFrom}
            />
          </View>
          <View style={styles.currencyConversionRow}>
            <TextInput
              style={[styles.currencyInput, styles.currencyBox]}
              placeholder="Converted Amount"
              value={convertedAmount}
              editable={false}
            />
            <TextInput
              style={[styles.currencyInput, styles.currencyBox]}
              placeholder="To Currency (e.g., EUR)"
              value={currencyTo}
              onChangeText={setCurrencyTo}
            />
          </View>
          <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>

        {/* Spending Summary */}
        <View style={[styles.card, styles.spendingSummaryCard]}>
          <Text style={styles.cardTitle}>Spending Summary</Text>
          <Text style={styles.cardSubtitle}>October 2024</Text>
          <Text style={styles.budgetText}>Budget: $2000</Text>
          <ProgressChart
            data={progressData}
            width={screenWidth - 32}
            height={120}
            strokeWidth={10}
            radius={30}
            chartConfig={chartConfig}
            hideLegend={false}
          />
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseAmount}>Spent: $1400</Text>
            <Text style={styles.availableAmount}>Available: $600</Text>
          </View>
        </View>

        {/* Spending Breakdown */}
        <View style={[styles.card, styles.spendingBreakdownCard]}>
          <Text style={styles.cardTitle}>Spending Breakdown</Text>
          <BarChart
            style={{ marginVertical: 8 }}
            data={barChartData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero={true}
            showValuesOnTopOfBars={true}
          />
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
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  currencyConversionCard: {
    alignItems: "flex-start",
    paddingHorizontal: 16,
  },
  spendingSummaryCard: {
    marginVertical: 8,
  },
  spendingBreakdownCard: {
    marginVertical: 8,
    alignSelf: "stretch",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  expenseInfo: {
    marginTop: 8,
    alignItems: "center",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
  },
  availableAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#388e3c",
    marginTop: 4,
  },
  currencyConversionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  currencyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  convertButton: {
    backgroundColor: "#1c313a",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
  convertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DashboardPage;
