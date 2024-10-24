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
