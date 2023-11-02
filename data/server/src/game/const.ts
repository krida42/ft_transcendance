export const TIMESTEP = 1/60;
export const MAXSTEP = 10;
export let LASTTIME = Date.now();

//Game state
export const SCORE_TO_WIN = 11;

// World dimensions
export const HEIGHT = 600;
export const WIDTH = 800;

// Ball dimensions
export const BALL_RADIUS = 10;


const BALL_VELOCITY_X = 30;
const BALL_VELOCITY_Y = 10;
export const BALL_VELOCITY = [BALL_VELOCITY_X, BALL_VELOCITY_Y];
export const BALL_VELOCITY_MAX = 200;

const BALL_POSITION_X = WIDTH / 2;
const BALL_POSITION_Y = HEIGHT / 2;
export const BALL_POSITION = [BALL_POSITION_X, BALL_POSITION_Y];

export const BALL_MASS = 1;

// Player
export const DISCONNECTED = 0;
export const CONNECTED = 1;
export const SEARCH = 2;
export const INGAME = 3;

// Setup bits for each available group of collision
export const PADDLE = Math.pow(2,0);
export const BALL =  Math.pow(2,1);
export const WALL = Math.pow(2,2);