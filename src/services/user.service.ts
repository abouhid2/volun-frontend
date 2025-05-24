import axiosInstance from './axios.config';

export interface User {
  id: number;
  name: string;
  email: string;
  telephone?: string;
  created_at?: string;
  updated_at?: string;
}

export const UserService = {
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  async create(user: Partial<User>): Promise<User> {
    const response = await axiosInstance.post('/users', { user });
    return response.data;
  },

  async update(id: number, user: Partial<User>): Promise<User> {
    const response = await axiosInstance.put(`/users/${id}`, { user });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },

  async getCurrentUserDetails(): Promise<User> {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  }
}; 