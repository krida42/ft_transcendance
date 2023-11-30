import { socket } from "./index";
import { useFriendStore } from "@/stores/friend";

const friendStore = useFriendStore();

socket.on("cocorico", (data: any) => {
  console.log("cocorico event: ", data);
});

socket.on("gotFriendRequest", (data: any) => {
  console.log("gotFriendRequest event: ", data);
});

socket.on("status", (data: any) => {
  friendStore.updateFriendStatus(data.userId, data.status);
  console.log("status event: ", data);
});
