// src/utils/api.ts
import axios from 'axios'; // 引入axios库

// 创建axios实例
const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
    }
});

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    console.log('error', error)
    if (error.response && error.response.status === 401) {
        console.error('登录过期，请重新登录');
        // 可以在这里添加跳转到登录页面的逻辑
    }
    return Promise.reject(error);
});

export const fetchAPI = async (url: string, method: string, data?: unknown) => {
    try {
        const response = await axiosInstance({
            url: url,
            method: method,
            data: data,
        });

        return response.data;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};
