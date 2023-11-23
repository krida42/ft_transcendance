import { socket } from "./index";

socket.on("cocorico", (data: any) => {
  console.log("cocorico event: ", data);
});

socket.on("gotFriendRequest", (data: object) => {
  console.log("gotFriendRequest event: ", data);
});
