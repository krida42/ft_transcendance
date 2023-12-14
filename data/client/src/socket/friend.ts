import { socket } from "./index";
import { useFriendStore } from "@/stores/friend";
import { useMainStore } from "@/stores/main";
import { Status } from "@/types";

const friendStore = useFriendStore();
const mainStore = useMainStore();

socket.on("cocorico", (data: any) => {
  console.log("cocorico event: ", data);
});

socket.on("gotFriendRequest", (data: any) => {
  console.log("gotFriendRequest event: ", data);
});

socket.on("status", (data: any) => {
  if (friendStore.friends.get(data.userId)) {
    friendStore.updateFriendStatus(data.userId, data.status);
  }
});
