import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../../services/authService';
import { ProgressChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ["Utilized"],
  data: [0.554],
};

const DashboardPage = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        if (!isAuth) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        // Try to get cached user data first
        const cachedUser = await AsyncStorage.getItem('user');
        if (cachedUser) {
          setUserData(JSON.parse(cachedUser));
        }

        // Fetch fresh user data
        const freshUserData = await AuthService.getUserProfile();
        if (freshUserData) {
          setUserData(freshUserData);
          await AsyncStorage.setItem('user', JSON.stringify(freshUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        if (error.message.includes('token')) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          Alert.alert(
            'Error',
            'Failed to load user data. Please try again later.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi, {userData?.username || 'User'}!</Text>
        </View>
        <TouchableOpacity style={styles.currencyContainer}>
          <Text style={styles.currency}>USD</Text>
          <Icon name="chevron-down-outline" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Spending Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending Summary</Text>
        <Text style={styles.cardSubtitle}>October 2024</Text>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseAmount}>Expenses</Text>
          <Text style={styles.expenseValue}>$1324</Text>
          <Text style={styles.availableAmount}>Available</Text>
          <Text style={styles.availableValue}>$676</Text>
        </View>
      </View>

      {/* Spending Categories Card */}
      <View style={[styles.card, styles.categoriesCard]}>
        <Text style={styles.cardTitle}>Spending Categories</Text>
        <Text style={styles.cardSubtitle}>October 2024</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currency: {
    fontSize: 16,
    marginRight: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  categoriesCard: {
    backgroundColor: '#e8f5e9',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  expenseInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  expenseValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d32f2f',
  },
  availableAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  availableValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#388e3c',
  },
});

export default DashboardPage;