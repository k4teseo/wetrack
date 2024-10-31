export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserData;
}