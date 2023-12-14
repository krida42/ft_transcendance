// import { socketGame as socket } from "./index";
import { socket as socket } from "@/socket/index";
import router from "@/router";
import { setOptions } from "@/game/game";

socket.on("got-invite-to-play", (key: string) => {
  console.log("got-invite-to-play event: ", key);
  //   window.prompt("Vous avez reçu une invitation à jouer", key);
  setOptions({ key });
  router.push("/pong");
});

// socket.on("randomRoom", (data: any) => {
//   console.log("randomRoom event: ", data);
// });

// socket.on("play", () => {
//   router.push("/pong");
// });

// socket.on("waiting", () => {
//   console.log("waiting");
//   router.push("/main/waiting");
// });

// socket.on("invite", (data: any) => {
//   console.log("invite event: ", data);
//   router.push("/main/invite");
// });
