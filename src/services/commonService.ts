import axiosInstance from '../utils/axiosInstance';

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
