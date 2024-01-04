// import { socketGame as socket } from "./index";
import { socket as socket } from "@/socket/index";
import router from "@/router";
import { setOptions } from "@/game/game";

socket.on("got-invite-to-play", (key: string) => {
  console.log("got-invite-to-play event: ", key);
  if (window.location.href === `${process.env.VUE_APP_CUICUI}:8080/pong`) {
    window.location.reload();
  }
  // window.location.href = `${process.env.VUE_APP_CUICUI}:8080/pong`;
  console.log(key);
  setOptions({ key });
  console.log("PONGGGGG: ");
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
