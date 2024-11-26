import axiosInstance from '../utils/axiosInstance';
import {APIResponse} from '../types';

export const getHostList = async (
  keyword: string,
  page: number,
): Promise<APIResponse> => {
  try {
    console.log('keyword =========> ', keyword);
    const response = await axiosInstance.get<APIResponse>('hosts', {
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

export const getHost = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(`hosts/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createHost = async (
  firsName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('hosts', {
      first_name: firsName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateHost = async (
  id: number,
  firsName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.put<APIResponse>(`hosts/${id}`, {
      first_name: firsName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteHost = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.delete<APIResponse>(`hosts/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};
