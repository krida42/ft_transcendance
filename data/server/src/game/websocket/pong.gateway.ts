import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { Inject } from '@nestjs/common';
import * as p2 from 'p2-es';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  private players: Map<Socket, ResponseUserDto> = new Map();
  constructor(@Inject(UsersService) private usersService: UsersService) {} // Injectez le service ici


	handleConnection(client: Socket) {
    let cookie = client.client.request.headers.cookie;
    if (!cookie) {
      return;
    }
    cookie = cookie.replace('access_token=', '');
    const user = jwt.decode(cookie) as ResponseUserDto;
    this.players.set(client, user);
    console.log(`Client connected: ${user.login}`);
	}

	handleDisconnect(client: Socket) {
    const user = this.players.get(client);
    console.log(`Client disconnected: ${user.pseudo}`);
    this.players.delete(client);
	}

  sendBall(ball:p2.Vec2) {
    // console.log(`Send ball to client`, ball);
    this.server.emit('ball', ball);
    // client.emit('user', user);
  }
  
  // Broadcast the message to all connected clients
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const user = this.players.get(client);
    console.log(`Received message from client ${user.pseudo}: ${data}`);
    // Envoyer un message de retour au client spécifique
    client.emit('message', `Server received your message: ${data}`);
  }
  
}