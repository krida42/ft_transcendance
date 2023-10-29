import { Scene } from "phaser";
import sky from "@/assets/game/sky.png";
import bomb from "@/assets/game/bomb.png";
import thudMp3 from "@/assets/game/thud.mp3";
import thudOgg from "@/assets/game/thud.ogg";
import paddle from "@/assets/game/paddle.svg";
import io from "socket.io-client";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("bomb", bomb);
    this.load.audio("thud", [thudMp3, thudOgg]);
    this.load.svg("paddle", paddle, { width: 100, height: 100 });
  }

  create() {
    // Établissez la connexion avec le serveur WebSocket
    const socket = io("ws://localhost:3001", { transports: ["websocket"] });

    // Écoutez les événements du serveur
    socket.on("message", (data) => {
      console.log("Message from server:", data);
      // Vous pouvez gérer le message reçu ici
    });

    socket.emit("message", "Hello, server!");

    // const socket = new WebSocket("ws://localhost:3001"); // Utilisez "ws://" au lieu de "http://"
    // socket.addEventListener("open", () => {
    //   console.log("Connected to WebSocket server");
    //   socket.send("Hello, server!");
    // });

    // socket.addEventListener("message", (event) => {
    //   console.log("Message from server:", event.data);
    // });

    this.scene.start("PlayScene");
  }
}
