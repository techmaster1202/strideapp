import {JobDetailedFormData} from '../types';
import axiosInstance from '../utils/axiosInstance';

export const getCalendarEvents = async (params: Record<string, any>) => {
  try {
    const response = await axiosInstance.get('calendar/events', {
      params,
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const createNewJob = async (data: JobDetailedFormData) => {
  try {
    const response = await axiosInstance.post('calendar/add_job', data);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};
