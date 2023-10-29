type Ball = {
	x: number;
	y: number;
	radius: number; // radius of the ball
	velocityX: number; // velocity of the ball along the x-axis
	velocityY: number; // velocity of the ball along the y-axis
}

type Paddle = {
	x: number;
	y: number;
	width: number;
	height: number;
	score: number; // score of the paddle
}