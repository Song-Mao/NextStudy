"use client";

import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { login } from '@/lib/request/api/allApi';
export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast()
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('666666');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 调用登录接口
        const response = await login(username, password);
        console.log('response', response)
        const success = response.success; // 假设接口返回一个 success 字段

        if (success) {
            // Store token in cookies
            document.cookie = `token=${response.user.token}; path=/;`; // 从user对象中获取token
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            localStorage.setItem('token', response.user.token);
            toast({
                title: "提示",
                description: "登录成功，喜欢您来~",
            })
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } else {
            // 处理登录失败的情况，例如显示错误消息
            console.error('登录失败:', response.message);
            alert(`登录失败: ${response.message}`); // 显示登录失败的通知
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        登录账户
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="用户名"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            登录
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
