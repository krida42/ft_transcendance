import { reactive } from "vue";
import { io } from "socket.io-client";
import { Status } from "@/types";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

// const host = process.env.VUE_APP_API_URL;
const host = `${process.env.VUE_APP_CUICUI}:3001/social`;
// const hostGame = "${process.env.VUE_APP_CUICUI}:3001/game";
export const state = reactive({
  connected: false,
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = host;
// const URLGame = hostGame;
//   process.env.NODE_ENV === "production" ? undefined : "${process.env.VUE_APP_CUICUI}:3000";

export const socket = io(URL, {
  withCredentials: true,
  // forceNew: true,
});

// export const socketGame = io(URLGame, {
// withCredentials: true,
// });

// export const socket = io("ws://localhost:3001/social", {
//   transports: ["websocket"],
// });

let intervalId: number | null = null;

socket.on("connect", () => {
  state.connected = true;
  // socket.emit("cuicui", { msg: "Hello from client" }, (response: any) => {
  //   console.log("cuicui acknowledged: ", response);
  // });
  // console.log("emit status");
  intervalId = setInterval(() => {
    socket.emit("status", mainStore.status, (response: any) => {
      // console.log("status acknowledged, this is my status: ", response);
      mainStore.status = response.status;
    });
  }, 1000);
});

socket.on("disconnect", () => {
  state.connected = false;
  if (intervalId) clearInterval(intervalId);
});
//Pour les effet de bord
import("./friend");
import("./message");
import("./game");
