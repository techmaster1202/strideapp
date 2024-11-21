import {Theme} from '@react-navigation/native';

export type Navigation = {
  openDrawer(): void;
  goBack(): void;
  navigate: (scene: string, params?: {[key: string]: any}) => void;
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
  data: any;
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

export interface UserDetailFormData {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  role: string;
}

export interface CleanerDetailFormData {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
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

export interface Role {
  name: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  createdDate: string;
  phone: string;
  rate: string;
  acct: string;
  registerDate: string;
  lastLoginDate: string;
  cancelDate: string;
  stripeId: string;
  payStatus: string;
}

export interface Cleaner {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  car_count: number;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface UpdateUserScreenProps {
  navigation: Navigation;
  route: any;
}
