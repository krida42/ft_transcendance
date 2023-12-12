import { socketGame as socket } from "./index";
import { socket as socketSocial } from "@/socket/index";
import router from "@/router";

socket.on("randomRoom", (data: any) => {
  console.log("randomRoom event: ", data);
});

socket.on("play", () => {
  router.push("/pong");
});

socket.on("waiting", () => {
  console.log("waiting");
  router.push("/main/waiting");
});

socket.on("invite", (data: any) => {
  console.log("invite event: ", data);
  router.push("/main/invite");
});
