import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { Player } from '../type';
import { CONNECTED, SEARCH } from '../const';

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
  private usersMap: Map<Socket, ResponseUserDto> = new Map();
  playerList: Player[] = [];

  getCookies(socket: Socket) {
    let cookie = socket.client.request.headers.cookie;
    if (!cookie) {
      return;
    }
    cookie = cookie.replace('access_token=', '');
    return cookie;
  }

	handleConnection(client: Socket) {
    const cookie = this.getCookies(client);
    const user = jwt.decode(cookie) as ResponseUserDto;
    this.usersMap.set(client, user);
    this.playerList.push({client: client, status: CONNECTED});

    console.log(`Client connected: ${user.login}`);
    return;
    // this.server.emit('connect', user);
	}

	handleDisconnect(client: Socket) {
    const user = this.usersMap.get(client);
    console.log(`Client disconnected: ${user.pseudo}`);
    this.usersMap.delete(client);
    this.playerList.splice(this.playerList.indexOf({client: client, status: CONNECTED}), 1);

    // this.server.emit('disconnect', user);
	}

  getClientInPlayerList(client: Socket): Player {
    for (let i = 0; i < this.playerList.length; i++) {
      if (this.playerList[i].client === client) {
        return this.playerList[i];
      }
    }
  }

  @SubscribeMessage('searchGame')
  searchGame(@ConnectedSocket() client: Socket) {
    const user = this.usersMap.get(client);
    this.getClientInPlayerList(client).status = SEARCH;
    
    console.log(`Client ${user.pseudo} searched a game`);
  }

  @SubscribeMessage('joinGame')
  joinGame(@ConnectedSocket() client: Socket) {
    const user = this.usersMap.get(client);
    console.log(`Client ${user.pseudo} joined the game`);
    // this.server.emit('joinGame', user);
  }

  
  @SubscribeMessage('newGame')
  newGame(){
    console.log('new game');
    
  }

  sendBall(ball) {
    console.log('send ball');
    console.log("position: ", ball);
    this.server.emit('ball', ball);
    // client.emit('user', user);
  }
  
  // Broadcast the message to all connected clients
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const user = this.usersMap.get(client);
    console.log(`Received message from client ${user.pseudo}: ${data}`);
    // Envoyer un message de retour au client spécifique
    client.emit('message', `Server received your message: ${data}`);
  }
  
}