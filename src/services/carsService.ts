import axiosInstance from '../utils/axiosInstance';
import {APIResponse, CarDetailFormData} from '../types';

export const getCarList = async (keyword: string): Promise<APIResponse> => {
  try {
    console.log('keyword =========> ', keyword);
    const response = await axiosInstance.get<APIResponse>('cars', {
      params: {
        q: keyword,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getCar = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(`cars/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getCarFormData = async (): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.get<APIResponse>(
      'cars/create/form-data',
    );
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createCar = async (
  data: CarDetailFormData,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse>('cars', data);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateCar = async (
  id: number,
  data: CarDetailFormData,
): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.put<APIResponse>(`cars/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteCar = async (id: number): Promise<APIResponse> => {
  try {
    const response = await axiosInstance.delete<APIResponse>(`cars/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const getEvents = async (start: string, end: string) => {
  try {
    const response = await axiosInstance.get('calendar/events', {
      params: {
        start,
        end,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};
