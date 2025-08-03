import api from './client';

// Signup
export const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
};

// Login
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Get Profile
export const getProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};
