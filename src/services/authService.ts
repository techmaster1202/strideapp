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
    console.log('axios response: ' + response);
    return response.data;
  } catch (error: any) {
    console.log('axios error: ' + error);
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
    console.log('axios response: ' + response);
    return response.data;
  } catch (error: any) {
    console.log('axios error: ' + error);
    throw error.response ? error.response.data : error.message;
  }
};
