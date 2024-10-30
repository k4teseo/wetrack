// index.js
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  description: string;
  date: string;
  category?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
}

AppRegistry.registerComponent(appName, () => App);

