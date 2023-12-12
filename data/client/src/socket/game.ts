import { socketGame as socket } from "./index";
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
