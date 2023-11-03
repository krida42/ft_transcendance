import { Socket } from 'socket.io';
import * as Matter from 'matter-js';
import { BallPong } from './instance/ball';
import { WorldPong } from './instance/worldPong';

// export type Ball = {
// 	body: p2.Body;
// 	shape: p2.Circle;
// }

export type Paddle = {
	position: [number, number];
	width: number;
	height: number;
}

export type Player = {
	client: Socket;
	status: number;
	color?: string;
	// paddle: Paddle;
	score?: number;
}

export type GameState = {
	scoreToWin: number; // score to win the game
	score1: number; // score P1
	score2: number; // score P2
	worldPong: WorldPong;
	ballPong: BallPong;
	// Player1: Player;
	// Player2: Player;
}

export type PlayerList = {
	players: Player[];
}


