import {Theme} from '@react-navigation/native';

export type Navigation = {
  navigate: (scene: string) => void;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}
export interface APIResponse {
  success: boolean;
  message: string;
  data: LoginResponse;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AppNavigatorProps {
  theme: Theme;
}

export interface SignInFormData {
  emailAddress: string;
  password: string;
}

export interface Props {
  navigation: Navigation;
}

export interface ResetPasswordFormData {
  emailAddress: string;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface UpdatePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
