// Importing types and libraries with TypeScript syntax
import express from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import next from 'next';

const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer: HTTPServer = createServer(server);
  const io: SocketIOServer = new SocketIOServer(httpServer);

  io.on('connection', (socket) => {
    console.log('WebSocket connection established');

    socket.on('new-message', (msg: string) => { // Added type for msg
      console.log('Received message:', msg);
      io.emit('broadcast-message', msg);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3001');
  });
});