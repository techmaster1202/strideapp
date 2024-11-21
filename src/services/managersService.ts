import axiosInstance from '../utils/axiosInstance';
import {APIResponse} from '../types';

export const getManagerList = async (
  keyword: string,
  page: number,
): Promise<APIResponse> => {
  try {
    console.log('keyword =========> ', keyword);
    const response = await axiosInstance.get<APIResponse>('managers_list', {
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

export const createManager = async (
  firsName: string,
  lastName: string,
  email: string,
  role: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('create_manager', {
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

export const updateManager = async (
  id: number,
  firsName: string,
  lastName: string,
  email: string,
  role: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('update_manager', {
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
