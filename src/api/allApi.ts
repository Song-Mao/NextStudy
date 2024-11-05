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
// 查询会话
export const conversation = async (data: { currentUserId: string, targetUserId: string }) => {
    return fetchAPI(`/conversation/getConversation`, 'Post', data);
};

// 创建会话
export const createConversation = async (data: { type: string, currentUserId: string, targetUserId: string }) => {
    return fetchAPI(`/conversation/create`, 'POST',  data );
};

// 查询所选用户的所有聊天记录
export const getCurrentConversationList = async (id:string) => {
    return fetchAPI(`/message/${id}`, 'GET');
};