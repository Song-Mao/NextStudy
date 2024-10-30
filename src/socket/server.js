// 导入所需库
import express from 'express';
import { createServer } from 'http';
import next from 'next';

// 判断是否为生产环境
const dev = process.env.NODE_ENV !== 'production';
// 创建next应用实例
const app = next({ dev });
// 获取next请求处理器
const handle = app.getRequestHandler();

// 等待next应用准备就绪
app.prepare().then(() => {
  // 创建express服务器
  const server = express();
  // 创建http服务器
  const httpServer = createServer(server);
  // 创建WebSocket服务器实例
  const io = new SocketIOServer(httpServer);

  // 监听WebSocket连接
  io.on('connection', (socket) => {
    console.log('WebSocket连接已建立');

    // 监听新消息事件
    socket.on('new-message', (msg) => {
      console.log('收到消息:', msg);
      // 广播消息给所有客户端
      io.emit('broadcast-message', msg);
    });

    // 监听断开连接事件
    socket.on('disconnect', () => {
      console.log('WebSocket已断开连接');
    });
  });

  // 处理所有HTTP请求
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // 启动服务器监听3000端口
  httpServer.listen(3000, () => {
    console.log('> 服务器已在 http://localhost:3000 启动');
  });
});
