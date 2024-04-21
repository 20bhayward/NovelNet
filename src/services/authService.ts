import api from './api';
const registerUser = async (username: string, password: string, role: string) => {
    try {
        const response = await api.post('/api/auth/register', { username, password, role });
        if (response.data.refreshPage) { window.location.reload(); }
    }
    catch (error) { throw error; }
};

const loginUser = async (username: string, password: string) => {
    try {
        const response = await api.post('/api/auth/login', { username, password });
        if (response.data.refreshPage) { window.location.reload(); }
    }
    catch (error) {
        throw error;
    }
};

const logout = async () => {
    try {
        await api.post('/api/auth/logout');
    }
    catch (error) {
        console.error('Error during logout:', error);
    }
};


export { registerUser, loginUser, logout };