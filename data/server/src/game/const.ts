
// Game state
export const SCORE_TO_WIN = 11;
export const TIME_END_GAME = 1 * 60 * 1000; // 5 minutes en millisecondes
export const BEFORE_GAME = 3 * 1000; // 3 secondes en millisecondes

// World dimensions
export const HEIGHT = 600;
export const WIDTH = 800;

// Wall dimensions
export const WALL_THICKNESS = 50;

// Ball dimensions
export const BALL_RADIUS = 20;

const BALL_VELOCITY_X = 30;
const BALL_VELOCITY_Y = 10;
export const BALL_VELOCITY = [BALL_VELOCITY_X, BALL_VELOCITY_Y];
export const BALL_VELOCITY_MAX = 200;

const BALL_POSITION_X = WIDTH / 2;
const BALL_POSITION_Y = HEIGHT / 2;
export const BALL_POSITION = [BALL_POSITION_X, BALL_POSITION_Y];

export const BALL_MASS = 1;

// Paddle dimensions
export const PADDLE_WIDTH = 20;
export const PADDLE_HEIGHT = 100;
export const PADDLE_VELOCITY = 10;
export const PADDLE_VELOCITY_MAX = 200;
export const POSITION_PADDLE_1_x = WIDTH - PADDLE_WIDTH;
export const POSITION_PADDLE_1_y = HEIGHT / 4;
export const POSITION_PADDLE_2_x = PADDLE_WIDTH;
export const POSITION_PADDLE_2_y = HEIGHT / 2;

// Time Disconnect
export const TIMEOUT_RECONNECT = 10000;

// Player
export const DISCONNECTED = 0;
export const CONNECTED = 1;
export const SEARCH = 2;
export const INGAME = 3;
