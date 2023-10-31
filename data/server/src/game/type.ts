import { Socket } from 'socket.io';
import * as p2 from 'p2-es';

export type Paddle = {
	position: p2.Vec2;
	width: number;
	height: number;
}

export type Player = {
	client: Socket;
	paddle: Paddle;
	score: number;
}

export type GameState = {
	scoreToWin: number; // score to win the game
	score1: number; // score P1
	score2: number; // score P2
	ball: p2.Body;
	Player1: Player;
	Player2: Player;
}

export type Game = {
	id: string;
	gameState: GameState;
}

export type GameList = {
	games: Game[];
}

export type PlayerList = {
	players: Player[];
}


