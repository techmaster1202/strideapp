import axiosInstance from '../utils/axiosInstance';
import {APIResponse} from '../types';

export const getCleanerList = async (
  keyword: string,
  page: number,
): Promise<APIResponse> => {
  try {
    console.log('keyword =========> ', keyword);
    const response = await axiosInstance.get<APIResponse>('cleaners', {
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

export const getCleaner = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(`cleaners/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createCleaner = async (
  firsName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('cleaners', {
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

export const updateCleaner = async (
  id: number,
  firsName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.put<APIResponse>(`cleaners/${id}`, {
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

export const deleteCleaner = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.delete<APIResponse>(`cleaners/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const resetCleanerPassword = async (
  id: number | null,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>(
      `cleaner/reset_pasword/${id}`,
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
      `cleaner/${fileId}/delete_file`,
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
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};
