import * as p2 from 'p2-es'

const world = new p2.World({
  gravity: [0, 0] // Pas de gravité
  
});

// Ajouter la balle au monde
const ballBody = new p2.Body({
	mass: 1,
	position: [100, 100],
});

var ballShape = new p2.Circle({ radius: 1 });
ballBody.addShape(ballShape);

world.addBody(ballBody);

var groundBody = new p2.Body({
	mass: 0,
});

var groundShape = new p2.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

var timestep = 1 / 60; // Mettre à jour le monde à 60 FPS

// Dans une boucle de jeu, mettez à jour le monde
function gameLoop() {
  world.step(timestep);

  // Vérifier les collisions
  for (const contact of world.narrowphase.contactEquations) {
    // Traiter les collisions ici
  }
  console.log(ballBody.position);
  // Mettre à jour la position de la balle, etc.

  // Répéter la boucle de jeu
//   requestAnimationFrame(gameLoop);
  
}

gameLoop();
