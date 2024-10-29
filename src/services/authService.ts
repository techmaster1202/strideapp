import axiosInstance from '../utils/axiosInstance';
import {LoginRequest, APIResponse, SignupRequest} from '../types';

export const login = async (
  email: string,
  password: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('login', {
      email,
      password,
    } as LoginRequest);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const signup = async (
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  password: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('signup', {
      first_name,
      last_name,
      phone,
      email,
      password,
    } as SignupRequest);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateProfile = async (
  first_name: string,
  last_name: string,
  email: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('updateProfile', {
      first_name,
      last_name,
      email,
    } as SignupRequest);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updatePassword = async (
  current_password: string,
  password: string,
  password_confirmation: string,
  email: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('updatePassword', {
      current_password,
      password,
      password_confirmation,
      email,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const resetPassword = async (email: string): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('resetPassword', {
      email,
    } as SignupRequest);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteUserProfile = async (
  id: number | null,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('deleteUser', {
      id: id,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
