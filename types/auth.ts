// Authentication related types

export interface User {
  id: string;
  email: string;
  name: string;
  identity?: string;
  userType: 'student' | 'instructor' | 'admin';
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  userType: 'student' | 'instructor';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface LoginHookReturn {
  formData: LoginFormData;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  focusedField: string;
  registrationInfo: {
    email: string | null;
    message: string;
  } | null;
  setFocusedField: (field: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}