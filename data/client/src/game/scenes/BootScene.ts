import { Scene } from "phaser";
import sky from "@/assets/game/sky.png";
import ball from "@/assets/game/ball.png";
import thudMp3 from "@/assets/game/thud.mp3";
import thudOgg from "@/assets/game/thud.ogg";
import paddle from "@/assets/game/paddle.svg";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
export default class BootScene extends Scene {
  private socket!: Socket;
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("ball", ball);
    this.load.audio("thud", [thudMp3, thudOgg]);
    this.load.svg("paddle", paddle, { width: 100, height: 100 });
  }

  create() {
    // const socket = io("ws://localhost:3001", { transports: ["websocket"] });

    // // socket.on("currentPlayers", (players) => {
    // //   console.log("currentPlayers", players);
    // //   Object.keys(players).forEach((id) => {
    // //     if (players[id].playerId === socket.id) {
    // //       addPlayer(this, players[id]);
    // //     }
    // //   });
    // // });

    // // socket.on("message", (data) => {
    // //   console.log("Message from server:", data);
    // //   // Vous pouvez gérer le message reçu ici
    // // });

    // socket.on("joinGame", (user) => {
    //   console.log("joinGame", user);
    //   // Vous pouvez gérer le message reçu ici
    // });

    // socket.on("user", (user) => {
    //   console.log("User received from server:", user);
    //   // Vous pouvez gérer l'utilisateur reçu ici
    //   // Assurez-vous d'avoir une scène active pour démarrer "PlayScene" ou ajustez la logique en conséquence.
    // });

    // let ballPosition = [300, 300];
    // socket.on("ball", (ball) => {
    //   const array = new Float32Array(ball);
    //   console.log("Ball received from server:", array[0], array[1]);
    //   ballPosition = [array[0], array[1]];
    // });

    // socket.emit("searchGame", "searchGame"); // envoye le client socket
    this.scene.start("PlayScene");
  }
}

// function addPlayer(self: any, playerInfo: any) {
//   const ship = self.physics.add
//     .image(playerInfo.x, playerInfo.y, "ship")
//     .setOrigin(0.5, 0.5)
//     .setDisplaySize(53, 40);
//   if (playerInfo.team === "blue") {
//     ship.setTint(0x0000ff);
//   } else {
//     ship.setTint(0xff0000);
//   }
//   ship.setDrag(100);
//   ship.setAngularDrag(100);
//   ship.setMaxVelocity(200);
// }
