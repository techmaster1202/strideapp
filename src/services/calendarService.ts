import {APIResponse, JobDetailedFormData} from '../types';
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

export const createStripeSubscription = async () => {
  try {
    const response = await axiosInstance.get('stripe/create_subscription');
    return response.data;
  } catch (error: any) {
    console.log('error', error.response);
    throw error.response ? error.response.data : error.message;
  }
};

export const startEvent = async (id: number) => {
  return axiosInstance.put(`calendar/appointments/${id}/start`);
};

export const finishEvent = async (id: number) => {
  return axiosInstance.put(`calendar/appointments/${id}/mark/completed`);
};

export const updateEvent = async (id: number, payload: Record<string, any>) => {
  console.log(`id: ${id}`);
  return axiosInstance.put(`calendar/appointments/${id}`, payload);
};

export const deleteEvent = async (id: number) => {
  return axiosInstance.delete(`calendar/appointments/${id}`);
};

export const deleteEventFile = async (fileId: string) => {
  try {
    const response = await axiosInstance.delete<APIResponse>(
      `/calendar/appointments/attachments/${fileId}/delete`,
    );
    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error.response ? error.response.data : error.message;
  }
};
