import axiosInstance from '../utils/axiosInstance';
import {APIResponse} from '../types';

export const getRoleList = async (): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>('roles');
    console.log('roles');
    console.log(response.data.data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getRole = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(`roles/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createRole = async (
  name: string,
  permissions: number[],
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('roles', {
      name: name,
      permissions: permissions,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateRole = async (
  id: number,
  name: string,
  permissions: number[],
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.put<APIResponse>(`roles/${id}`, {
      name: name,
      permissions: permissions,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteRole = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.delete<APIResponse>(`roles/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const getPermissionList = async () => {
  try {
    const response = await axiosInstance.get<APIResponse>('permissions');
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};
