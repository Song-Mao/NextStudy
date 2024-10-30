import { fetchAPI } from '../request';

export const login = async (username: string, password: string) => {
    return fetchAPI('/api/auth/login', 'POST', { username, password });
};

export const getUserList = async () => {
    return fetchAPI('/api/user/getUserList', 'GET', {});
};