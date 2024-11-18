// hooks/useCurrencyConversion.js
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

export const useCurrencyConversion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rate, setRate] = useState(null);

  const convertCurrency = async (amount, fromCurrency = 'GBP', toCurrency = 'USD') => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Converting:', { amount, fromCurrency, toCurrency });

      const response = await axios.get(`${API_URL}/api/currency/convert/`, {
        params: {
          amount,
          from: fromCurrency,
          to: toCurrency
        }
      });

      console.log('Conversion response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Store the exchange rate
      if (response.data.rate) {
        setRate(response.data.rate);
      }

      return response.data;
    } catch (error) {
      console.error('Conversion error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      const errorMessage = error.response?.data?.error || error.message || 'Conversion failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getExchangeRate = async (fromCurrency = 'GBP', toCurrency = 'USD') => {
    try {
      console.log('Getting rate for:', { fromCurrency, toCurrency });

      const response = await axios.get(`${API_URL}/api/currency/rate/`, {
        params: {
          from: fromCurrency,
          to: toCurrency
        }
      });

      console.log('Rate response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const newRate = response.data.rate;
      setRate(newRate);
      return newRate;
    } catch (error) {
      console.error('Rate fetch error:', error);
      return null;
    }
  };

  return {
    convertCurrency,
    getExchangeRate,
    rate,
    isLoading,
    error
  };
};

export default useCurrencyConversion;