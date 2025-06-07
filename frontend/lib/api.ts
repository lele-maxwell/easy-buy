import axios from 'axios';
import Cookies from 'js-cookie';

// Ensure we have a valid API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout and withCredentials
    timeout: 10000,
    withCredentials: true
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            baseURL: API_URL
        });

        if (error.response?.status === 401) {
            // Handle unauthorized access
            Cookies.remove('token');
            Cookies.remove('userData');
            Cookies.remove('userRole');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: async (email: string, password: string) => {
        try {
            console.log('Making login request to:', `${API_URL}/api/auth/login`);
            const response = await api.post('/api/auth/login', { email, password });
            console.log('Raw login response:', response);
            
            // Check if response has the expected structure
            if (!response.data) {
                throw new Error('Invalid response format: No data received');
            }

            // Ensure the response has the required fields
            const { token, user } = response.data;
            if (!token) {
                throw new Error('Invalid response format: No token received');
            }
            if (!user) {
                throw new Error('Invalid response format: No user data received');
            }

            // Ensure user object has required fields
            if (!user.id && !user._id) {
                throw new Error('Invalid user data: Missing user ID');
            }
            if (!user.email) {
                throw new Error('Invalid user data: Missing email');
            }
            if (!user.name) {
                throw new Error('Invalid user data: Missing name');
            }

            return {
                token,
                user: {
                    id: user.id || user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user'
                }
            };
        } catch (error: any) {
            console.error('Login API error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack,
                baseURL: API_URL
            });
            
            // Provide more specific error messages
            if (error.response?.status === 401) {
                throw new Error('Invalid email or password');
            } else if (error.response?.status === 404) {
                throw new Error('Login service not found');
            } else if (error.response?.status === 500) {
                throw new Error('Server error occurred');
            } else if (!error.response) {
                throw new Error('Network error: Could not connect to server. Please check if the server is running at ' + API_URL);
            }
            
            throw error;
        }
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/api/auth/register', { name, email, password });
        return response.data;
    },
    updateProfile: async (data: { name?: string; email?: string }) => {
        const response = await api.put('/api/user/profile', data);
        return response.data;
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
        const response = await api.put('/api/auth/password', { 
            current_password: currentPassword, 
            new_password: newPassword 
        });
        return response.data;
    },
    verifyToken: async () => {
        try {
            const response = await api.get('/api/auth/verify', { 
                timeout: 5000,
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            return {
                isValid: true,
                user: response.data
            };
        } catch (error) {
            console.error('Token verification error:', error);
            return {
                isValid: false,
                error: error.response?.data || 'Token verification failed'
            };
        }
    },
};

export const products = {
    list: async () => {
        const response = await api.get('/api/products');
        return response.data;
    },
    get: async (id: string) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },
    search: async (query: string) => {
        const response = await api.get(`/api/products/search?query=${query}`);
        return response.data;
    },
};

export const cart = {
    get: async () => {
        const response = await api.get('/api/cart');
        return response.data;
    },
    add: async (productId: string, quantity: number) => {
        const response = await api.post('/api/cart', { product_id: productId, quantity });
        return response.data;
    },
    remove: async (productId: string) => {
        const response = await api.delete(`/api/cart/${productId}`);
        return response.data;
    },
};

export const admin = {
    products: {
        create: async (data: any) => {
            const response = await api.post('/api/admin/products', data);
            return response.data;
        },
        update: async (id: string, data: any) => {
            const response = await api.put(`/api/admin/products/${id}`, data);
            return response.data;
        },
        delete: async (id: string) => {
            const response = await api.delete(`/api/admin/products/${id}`);
            return response.data;
        },
    },
    users: {
        list: async () => {
            const response = await api.get('/api/admin/users');
            return response.data;
        },
        updateRole: async (userId: string, role: 'admin' | 'user') => {
            const response = await api.put(`/api/admin/users/${userId}/role`, { role });
            return response.data;
        },
    },
};

export default api; 