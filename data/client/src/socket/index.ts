import { reactive } from "vue";
import { io } from "socket.io-client";

// const host = process.env.VUE_APP_API_URL;
const host = "http://localhost:3001/";

export const state = reactive({
  connected: false,
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = host;
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to server");
  state.connected = true;
  socket.emit("cuicui", { msg: "Hello from client" }, (response: any) => {
    console.log("cuicu acknowledged: ", response);
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  state.connected = false;
});

socket.on("cocorico", (data) => {
  console.log("cocorico event: Received: ", data);
});
