import * as p2 from 'p2-es';
import { BALL, HEIGHT, PADDLE, WALL, WIDTH } from '../const';

export class WorldPong {
	world = new p2.World({
		gravity: [0, 0]
	});
	topWall: p2.Body;
	bottomWall: p2.Body;
	leftWall: p2.Body;
	rightWall: p2.Body;

	wallThickness = 10;
  wallMaterial = new p2.Material();

	constructor() {
		this.initWorld();
	}

	initWorld() {
		this.createWalls();
	}

	createBody(x: number, y: number): p2.Body {
		const body = new p2.Body({
			mass: 0,
			position: [x, y],
			// angle: angle,
      type: p2.Body.KINEMATIC,
		});
		return body;
	}

  createShapeCollider(wall: p2.Body, width: number, height: number){
    const wallShape = new p2.Box({ width: width, height: height});
    groupCollider(wallShape, WALL);
    wallShape.material = this.wallMaterial;
    wall.addShape(wallShape);
    this.world.addBody(wall);
  }
  
  createUpWall() {
    this.topWall = this.createBody(WIDTH / 2, HEIGHT - this.wallThickness / 2);
    this.createShapeCollider(this.topWall, WIDTH, this.wallThickness);
  }
  
  createDownWall() {
    this.bottomWall = this.createBody(WIDTH / 2, this.wallThickness / 2);
    this.createShapeCollider(this.bottomWall, WIDTH, this.wallThickness);
  }
  
  createLeftWall() {
    this.leftWall = this.createBody(this.wallThickness / 2, HEIGHT / 2);
    this.createShapeCollider(this.leftWall, this.wallThickness, HEIGHT);
  }
  
  createRightWall() {
    this.rightWall = this.createBody(WIDTH - this.wallThickness / 2, HEIGHT / 2);
    this.createShapeCollider(this.rightWall, this.wallThickness, HEIGHT);
  }

	isTouchingWall(object:p2.Shape): p2.Body | null {
    if ((object.collisionGroup & WALL) !=0 && (WALL & object.collisionMask) !=0) {
      if (object === this.topWall.shapes[0]) {
        return this.topWall;
      } else if (object === this.bottomWall.shapes[0]) {
        return this.bottomWall;
      } else if (object === this.leftWall.shapes[0]) {
        return this.leftWall;
      } else if (object === this.rightWall.shapes[0]) {
        return this.rightWall;
      }
    }
    return null;
  }

	createWalls() {
		this.createUpWall();
		this.createDownWall();
		this.createLeftWall();
		this.createRightWall();
	}
}

export function groupCollider(shape: p2.Shape, group: number) {
	shape.collisionGroup = group;
	if (group === WALL)
		shape.collisionMask = BALL | PADDLE;
	else if (group === BALL)
		shape.collisionMask = WALL | PADDLE;
	else if (group === PADDLE)
		shape.collisionMask = WALL | BALL;
	return group;
}
