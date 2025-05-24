import axiosInstance from './axios.config';
import { Picture, PictureType } from '../types';

export const PictureService = {
  // Get all pictures for a resource
  getPictures: async (resourceType: string, resourceId: number): Promise<Picture[]> => {
    const response = await axiosInstance.get(`/${resourceType}s/${resourceId}/pictures`);
    return response.data;
  },

  // Upload a picture for a user (profile picture)
  uploadUserProfilePicture: async (userId: number, file: File): Promise<Picture> => {
    const formData = new FormData();
    formData.append('picture[image]', file);
    
    const response = await axiosInstance.post(`/users/${userId}/pictures`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload a picture for an entity (cover picture)
  uploadEntityCoverPicture: async (entityId: number, file: File): Promise<Picture> => {
    const formData = new FormData();
    formData.append('picture[image]', file);
    
    const response = await axiosInstance.post(`/entities/${entityId}/pictures`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload pictures for an event (gallery)
  uploadEventPicture: async (eventId: number, file: File): Promise<Picture> => {
    const formData = new FormData();
    formData.append('picture[image]', file);
    
    const response = await axiosInstance.post(`/events/${eventId}/pictures`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete a picture
  deletePicture: async (resourceType: string, resourceId: number, pictureId: number): Promise<void> => {
    await axiosInstance.delete(`/${resourceType}s/${resourceId}/pictures/${pictureId}`);
  }
};
