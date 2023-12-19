import { socket } from "./index";
import { useFriendStore } from "@/stores/friend";
import { useMainStore } from "@/stores/main";
import { Status } from "@/types";
import { useUsersStore } from "@/stores/users";

const friendStore = useFriendStore();
const mainStore = useMainStore();
const usersStore = useUsersStore();

socket.on("cocorico", (data: any) => {
  console.log("cocorico event: ", data);
});

socket.on("friends-state-ping", (data: any) => {
  console.log("got friends-state-ping event: ", data);
  friendStore.refreshBlocked();
  friendStore.refreshFriendList();
  friendStore.refreshFriendsReceived();
  friendStore.refreshFriendsSent();
});

socket.on("status", (data: any) => {
  if (friendStore.friends.get(data.userId)) {
    friendStore.updateFriendStatus(data.userId, data.status);
  }
});
