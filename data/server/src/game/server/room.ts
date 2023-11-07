import { Room, Client } from "colyseus";
import jwt from 'jsonwebtoken';
import { UsersService } from '../../users/users.service';
import { GameInit } from "../instance/gameInit";
import { GameState } from '../type';
import { response } from 'express';

export class PongRoom extends Room {
  maxClients = 2;
  GameState: GameState;
  gameInterval: NodeJS.Timeout;
  displayInterval: NodeJS.Timeout;
  lastTime: number = 0;

  constructor() {
    super();
  }

  onCreate(response) {
    this.setState(GameInit.initGameState());
    this.gameInterval = setInterval(() => this.sendBallClient(), 1);

    this.onMessage("joinGame", (client, message) => {
      this.handleJoinGame(client);
    });

    this.onMessage("ball", (client, message) => {
      console.log("ball", message);
      this.state.ball = message;
      this.broadcast("ball", message);
    });
    response.setHeader('Access-Control-Allow-Origin', '*');
  }

  startGame() {
    this.setState(GameInit.initGameState());
    this.state.worldPong.run();
    this.gameInterval = setInterval(() => this.sendBallClient(), 1);
  }

  sendBallClient() {
    const ball = this.state.ballPong.ball.position;
    if (this.state.worldPong.engine.timing.timestamp - this.lastTime >= 1) {
      this.broadcast("ball", ball);
      console.log("position: ", this.state.ballPong.ball.velocity);
      this.lastTime = this.state.worldPong.engine.timing.timestamp;
    }
  }

  onJoin(client: Client, response: any) {
    console.log(`Client connected: ${client.sessionId}`);
    if (this.clients.length === 2) {
      this.startGame();
    }
    response.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  onLeave(client: Client) {
    // Supprimez le client de la map des joueurs
    console.log(`Client disconnected: ${client.sessionId}`);
  }
  
  handleJoinGame(client: Client) {
    console.log(`Client joined the game: ${client.sessionId}`);
  }
  
  onDispose() {
  console.log("Dispose PongRoom");
  }

  // async onAuth(client: Client, options: any, request: any) {
  //   const cookies = request.headers.cookie;
  //   const decode = jwt.decode(cookies);
  //   const user = await this.UsersService.findOne(decode.public_id);
  //   // Si l'authentification réussit, retournez les données du client
  //   // Sinon, retournez false pour rejeter la connexion
  // }
}
