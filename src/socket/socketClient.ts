// src/lib/socketService.ts

import { io, Socket } from 'socket.io-client';

// 定义事件名称的枚举
export enum SocketEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    CONNECT_ERROR = 'connect_error',
    MESSAGE = 'message',
   
}

export class SocketService {
    private socket: Socket | null = null;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        this.socket = io(this.url);

        this.socket.on(SocketEvents.CONNECT, () => {
            console.log('Socket.IO connection established');
        });

        this.socket.on(SocketEvents.DISCONNECT, () => {
            console.log('Socket.IO connection disconnected');
        });

        this.socket.on(SocketEvents.CONNECT_ERROR, (error) => {
            console.error('Socket.IO connection error:', error);
        });
    }

    on(event: SocketEvents, callback: (data: unknown) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    emit(event: SocketEvents, data: unknown) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    close() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}