import axios from 'axios';

// Debug Environment Initialization
console.log("API URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error);
    
    if (error.response && error.response.status === 401) {
      // If we get an unauthorized error, clear local info and force login
      localStorage.removeItem('adminInfo');
      // Only redirect if we're theoretically in an admin route or attempting to do an admin action
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const fetchProjects = async (location?: string) => {
  const url = location ? `/projects?location=${location}` : '/projects';
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, { withCredentials: true });
  return data;
};

export const fetchProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const fetchCategoryMedia = async (categoryName: string) => {
  const { data } = await api.get(`/media/category/${encodeURIComponent(categoryName)}`);
  return data;
};

export const fetchGoogleReviews = async () => {
  const { data } = await api.get('/google-reviews');
  return data;
};

export const adminLogin = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const adminLogout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const checkAuthStatus = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const createProject = async (projectData: any) => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

export const updateProject = async (id: string, projectData: any) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id: string) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const createCategory = async (projectId: string, categoryData: any) => {
  const { data } = await api.post(`/projects/${projectId}/categories`, categoryData);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

export const uploadMedia = async (categoryId: string, formData: FormData) => {
  const { data } = await api.post(`/categories/${categoryId}/media`, formData);
  return data;
};

export const deleteMedia = async (id: string) => {
  const { data } = await api.delete(`/media/${id}`);
  return data;
};

export const uploadCover = async (formData: FormData) => {
  const { data } = await api.post('/media/cover', formData);
  return data;
};

export default api;
