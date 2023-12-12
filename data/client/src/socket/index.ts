import { reactive } from "vue";
import { io } from "socket.io-client";
import { Status } from "@/types";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

// const host = process.env.VUE_APP_API_URL;
const host = "http://localhost:3001/social";
const hostGame = "http://localhost:3001/game";
export const state = reactive({
  connected: false,
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = host;
const URLGame = hostGame;
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL, {
  withCredentials: true,
});

export const socketGame = io(URLGame, {
  withCredentials: true,
});

// export const socket = io("ws://localhost:3001/social", {
//   transports: ["websocket"],
// });

socket.on("connect", () => {
  state.connected = true;
  socket.emit("cuicui", { msg: "Hello from client" }, (response: any) => {
    console.log("cuicui acknowledged: ", response);
  });
  console.log("emit status");
  socket.emit("status", Status.Online, (response: any) => {
    console.log("status acknowledged: ", response);
    mainStore.status = response.status;
  });
});

socket.on("disconnect", () => {
  state.connected = false;
});
//Pour les effet de bord
import("./friend");
import("./message");
import("./game");
