import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger("AppGateWay");

	handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
	}

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    // Handle received message
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }
}