import axiosInstance from '../utils/axiosInstance';
import {APIResponse} from '../types';

export const getManagerList = async (
  keyword: string,
  page: number,
): Promise<APIResponse> => {
  try {
    console.log('keyword =========> ', keyword);
    const response = await axiosInstance.get<APIResponse>('managers', {
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

export const getManager = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(`managers/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createManager = async (
  firsName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('managers', {
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

export const updateManager = async (
  id: number,
  firsName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.put<APIResponse>(`managers/${id}`, {
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

export const deleteManager = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.delete<APIResponse>(`managers/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const resetManagerPassword = async (
  id: number | null,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>(
      `manager/reset_pasword/${id}`,
      {
        id: id,
      },
    );
    return response.data;
  } catch (error: any) {
    console.log(error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const response = await axiosInstance.delete<APIResponse>(
      `manager/${fileId}/delete_file`,
    );
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const uploadAttachmentFile = async (url: string, data: FormData) => {
  try {
    const response = await axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error.response.data);
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllCarsByManager = async (id: number) => {
  try {
    const response = await axiosInstance.get('cars/by/manager', {
      params: {
        cleaner: id,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error.response.data);
    throw error.response ? error.response.data : error.message;
  }
};
