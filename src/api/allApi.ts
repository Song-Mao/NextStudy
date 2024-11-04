import { fetchAPI } from '../lib/request';

export const login = async (username: string, password: string) => {
    return fetchAPI('/auth/login', 'POST', { username, password });
};

export const getUserList = async () => {
    return fetchAPI('/auth/getUserList', 'GET', {});
};

export const logout = async (userId: string) => {
    return fetchAPI('/auth/logout', 'POST', { id:userId });
};
