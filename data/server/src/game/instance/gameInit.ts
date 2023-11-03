import { GameState, Player } from '../type';
import { SCORE_TO_WIN, INGAME, SEARCH } from '../const';
import { PongGateway } from '../websocket/pong.gateway';
import { Socket } from 'socket.io';
import { WorldPong } from './worldPong';
import { BallPong } from './ball';

export class GameInit {
	static id: number = 0;
	static pongGateway: PongGateway;
	
	static clientFound(): Socket {
		const playerList = this.pongGateway.playerList;

		for (let i = 0; i < playerList.length ; i++){
			if (playerList[i].status === SEARCH){
				playerList[i].status = INGAME;
				return playerList[i].client;
			}
		}
    return null;
	}
	
	static initGameState(): GameState {
    // if (this.pongGateway.playerList.length < 2) {
    //   console.log('Not enough player');
    //   return null;
    // }
		// const client1 = this.clientFound();
		// const client2 = this.clientFound();
		const worldPong = new WorldPong();

		const newGameState: GameState = {
			scoreToWin: SCORE_TO_WIN,
			score1: 0,
			score2: 0,
			worldPong: worldPong,
			ballPong: new BallPong(worldPong),
			// Player1: this.initPlayer1(client1),
			// Player2: this.initPlayer2(client2),
		};
		return newGameState;
	}
	
	static initPlayer1(client: Socket): Player {
		const newPlayer: Player = {
			client: null,
			status: INGAME,
			color: 'red',
			// paddle: initPaddle(),
			score: 0,
		};
		return newPlayer;
	}
	
	static initPlayer2(client: Socket): Player {
		const newPlayer: Player = {
			client: null,
			status: INGAME,
			color: 'blue',
			// paddle: initPaddle(),
			score: 0,
		};
		return newPlayer;
	}
}