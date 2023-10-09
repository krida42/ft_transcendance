import { defineStore } from "pinia";
import friendApi from "../api/friend";

export const useFriendStore = defineStore({
  id: "friend",
  state: (): {
    friendsMap: Map<Id, Friend>;
  } => ({
    friendsMap: new Map<Id, Friend>(),
  }),
  getters: {
    friends: (state) => new Map<Id, Friend>(state.friendsMap),
    getFriendNameById(state) {
      return (id: string) => {
        const friend = this.friends.get(id);
        return friend?.displayName || "Unknown";
      };
    },
    currentFriend: (state) => {
      return {
        id: "marine",
        displayName: "Marine",
      };
    },
  },
  actions: {
    refreshFriendList() {
      friendApi.fetchFriendList().then((friends) => {
        friends.forEach((friend: Friend) => {
          this.friendsMap.set(friend.id, friend);
        });
      });
    },
  },
});
