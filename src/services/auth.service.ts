import axiosInstance from './axios.config';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  telephone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  telephone?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    telephone?: string;
  };
}

export const AuthService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', { user: data });
    if (response.data.token) {
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', { auth: data });
    if (response.data.token) {
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  
  async updateProfile(data: UpdateProfileData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      throw new Error('User not authenticated');
    }
    
    const response = await axiosInstance.put(`/users/${currentUser.id}`, { user: data });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }
}; 