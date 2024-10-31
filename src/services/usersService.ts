import axiosInstance from '../utils/axiosInstance';
import {APIResponse} from '../types';

export const getUserList = async (
  keyword: string,
  page: number,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>('users_list', {
      params: {
        q: keyword,
        page: page,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllRoles = async (): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>('role_list');
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const createUser = async (
  firsName: string,
  lastName: string,
  email: string,
  role: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('create_user', {
      first_name: firsName,
      last_name: lastName,
      email: email,
      role: role,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUser = async (
  id: number,
  firsName: string,
  lastName: string,
  email: string,
  role: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('update_user', {
      id: id,
      first_name: firsName,
      last_name: lastName,
      email: email,
      role: role,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};
