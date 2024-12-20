import { io, Socket } from 'socket.io-client';

type EventData = ChatData[] | MessageData | null;

class SocketService {
    private socket: Socket | null = null;

    // 初始化Socket连接
    public connect(url: string, { token, userId }: { token: string, userId: string }): void {
        if (!this.socket) {
            this.socket = io(url, {
                query: {
                    token,
                    userId
                },
                reconnection: true, // 启用自动重连
                reconnectionAttempts: 30, // 最大重连尝试次数
                reconnectionDelay: 1000 // 重连延迟时间（毫秒）
            });

            this.socket.on('connect', () => {
                console.log('Socket.IO连接已建立');
                // 发送事件
            });

            this.socket.on('disconnect', () => {
                console.error('Socket.IO连接已断开');
                // 不要在断开连接时清除socket实例，以便自动重连
            });

            // 添加连接错误处理
            this.socket.on('connect_error', (error) => {
                console.error('Socket.IO连接失败:', error);
                // 不要在连接错误时清除socket实例，以便自动重连
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