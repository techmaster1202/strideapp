import axiosInstance from '../utils/axiosInstance';
import {APIResponse, PropertyDetailFormData} from '../types';

export const getPropertyList = async (
  keyword: string,
  page: number,
): Promise<APIResponse> => {
  try {
    console.log('keyword =========> ', keyword);
    const response = await axiosInstance.get<APIResponse>('properties', {
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

export const getPropertyData = async (): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(
      'properties/create/info',
    );
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const getProperty = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(`properties/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createProperty = async (
  data: PropertyDetailFormData,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('properties', data);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateProperty = async (
  data: PropertyDetailFormData,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.put<APIResponse>(
      `properties/${data.id}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteProperty = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.delete<APIResponse>(
      `properties/${id}`,
    );
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
      `property/${fileId}/delete_file`,
    );
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};
