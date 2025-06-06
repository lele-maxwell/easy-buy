import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
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
        const response = await api.put('/api/auth/password', { current_password: currentPassword, new_password: newPassword });
        return response.data;
    },
    verifyToken: async () => {
        try {
            console.log('Verifying token...');
            const response = await api.get('/api/auth/verify', { 
                timeout: 5000,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Token verification response:', response.data);
            return {
                isValid: true,
                user: response.data
            };
        } catch (error) {
            console.error('Token verification error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
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