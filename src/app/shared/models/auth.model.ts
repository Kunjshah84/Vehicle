export interface RegisterDto {
  FullName: string;
  Email: string;
  Password: string;
  Number: string;
}

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  number: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
}

export interface AuthState {
  token: string;
  user: AuthUser;
}
