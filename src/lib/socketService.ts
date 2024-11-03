import { io, Socket } from 'socket.io-client';

// 定义事件数据类型
interface ChatData {
    id: string;
    username: string;
    isOnline: boolean;
}

interface MessageData {
    content: string;
    sender: string;
    timestamp: string;
}

type EventData = ChatData[] | MessageData | null;

class SocketService {
    private socket: Socket | null = null;

    // 初始化Socket连接
    public connect(url: string, token: string): void {
        if (!this.socket) {
            this.socket = io(url, {
                query: {
                    token
                },
                reconnection: true, // 启用自动重连
                reconnectionAttempts: 5, // 最大重连尝试次数
                reconnectionDelay: 1000 // 重连延迟时间（毫秒）
            });

            this.socket.on('connect', () => {
                console.log('Socket.IO连接已建立');
                // 发送事件
            });

            this.socket.on('disconnect', () => {
                this.socket = null; // 清除socket实例
                console.log('Socket.IO连接已断开');
            });

            // 添加连接错误处理
            this.socket.on('connect_error', (error) => {
                console.error('Socket.IO连接失败:', error);
                this.socket = null; // 清除socket实例
            });

            // 监听重连尝试事件
            this.socket.on('reconnect_attempt', (attempt) => {
                console.log(`尝试重连: 第${attempt}次`);
            });
        }
    }

    // 监听事件
    public on(event: string, callback: (data: EventData) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // 发送事件
    public emit(event: string, data: EventData): void {
        if (this.socket) {
            console.log('Sending message:', data);
            this.socket.emit(event, data);
        } else {
            console.log('Socket.IO连接未建立');
        }
    }

    // 断开连接
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();