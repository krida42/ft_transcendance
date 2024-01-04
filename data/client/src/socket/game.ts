// import { socketGame as socket } from "./index";
import { socket as socket } from "@/socket/index";
import router from "@/router";
import { getOptions, setOptions } from "@/game/game";

socket.on("got-invite-to-play", (key: string) => {
  console.log("got-invite-to-play event: ", key);
  console.log("window.location.href: ", window.location.href);
  if (
    window.location.href.split("?")[0] ===
    `${process.env.VUE_APP_CUICUI}:8080/pong`
  ) {
    // setOptions({ key });
    // window.location.reload();
    window.location.search = `?key=${key}`;
    // console.log("reload");
  }
  // window.location.href = `${process.env.VUE_APP_CUICUI}:8080/pong`;
  console.log("la key: ", key);
  const urlParams = new URLSearchParams(window.location.search);
  const key_from_url = urlParams.get("key");
  if (!key_from_url && !key) {
    console.error("No key in url, c est pas normal");
    return;
  }
  console.log("key_from_url: ", key_from_url, "key: ", key);
  setOptions({ key: key_from_url || key });
  console.log("getOptions: ", getOptions());
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
