"use client";
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { login } from '@/api/allApi';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
export default function LoginPage() {

    const router = useRouter();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123456');

    const { toast } = useToast()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // 调用登录接口
        try {
            const { data } = await login(username, password);
            document.cookie = `token=${data.token}; path=/`;
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            // // data.token
            // socketService.connect(`http://localhost:4000`, data.token); //连接websocket

            // // 监听连接成功事件
            // socketService.on('connect', () => {
            //     console.log('连接成功');
            //     socketService.emit('message', { content: 'Hello, World!', sender: data.user.username, timestamp: new Date().toISOString() });
            // });
            toast({
                description: "🩷喜欢您来~",
                className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]",
            })

            setTimeout(() => {

                router.push('/chat');
            }, 1500);
        } catch (error) {
            // 处理登录失败的情况，例如显示错误消息
            alert(`登录失败: ${error.message}`); // 显示登录失败的通知
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
