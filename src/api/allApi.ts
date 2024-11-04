import { fetchAPI } from '../lib/request';

// 登录
export const login = async (username: string, password: string) => {
    return fetchAPI('/auth/login', 'POST', { username, password });
};
// 获取用户列表
export const getUserList = async () => {
    return fetchAPI('/user', 'GET', {});
};
// 退出登录
export const logout = async (userId: string) => {
    return fetchAPI('/auth/logout', 'POST', { id: userId });
};
// 获取会话
export const conversation = async (userId: string) => {
    return fetchAPI(`/conversation/${userId}`, 'GET');
};

// 创建会话
export const createConversation = async (data: { type: string }) => {
    return fetchAPI(`/conversation`, 'POST', { data });
};
