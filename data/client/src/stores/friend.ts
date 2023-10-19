import { defineStore } from "pinia";
import friendApi from "../api/friend";

import { Status } from "@/mtypes";

export const useFriendStore = defineStore({
  id: "friend",
  state: (): {
    friendsMap: Map<Id, Friend>;
    friendsReceivedMap: Map<Id, Friend>;
    friendsSentMap: Map<Id, Friend>;
    blockedMap: Map<Id, User>;
  } => ({
    friendsMap: new Map<Id, Friend>(),
    friendsReceivedMap: new Map<Id, Friend>(),
    friendsSentMap: new Map<Id, Friend>(),
    blockedMap: new Map<Id, User>(),
  }),
  getters: {
    friends: (state) => new Map<Id, Friend>(state.friendsMap),
    friendsReceived: (state) => new Map<Id, Friend>(state.friendsReceivedMap),
    friendsSent: (state) => new Map<Id, Friend>(state.friendsSentMap),
    blocked: (state) => new Map<Id, User>(state.blockedMap),
    DEBUG_friendsStatusRand() {
      const usersRandStatus = new Map<Id, User>();
      this.friends.forEach((user) => {
        usersRandStatus.set(user.id, {
          ...user,
          status: Object.values(Status)[Math.floor(Math.random() * 3)],
        });
      });
      return usersRandStatus;
    },
  },
  actions: {
    async refreshFriendList(): Promise<void> {
      return friendApi.fetchFriendList().then((friends) => {
        friends.forEach((friend: Friend) => {
          this.friendsMap.set(friend.id, friend);
        });
      });
    },
    async refreshFriendsReceived(): Promise<void> {
      return friendApi.fetchFriendsReceived().then((friends) => {
        friends.forEach((friend: Friend) => {
          this.friendsReceivedMap.set(friend.id, friend);
        });
      });
    },
    async refreshFriendsSent(): Promise<void> {
      return friendApi.fetchFriendsSent().then((friends) => {
        friends.forEach((friend: Friend) => {
          this.friendsSentMap.set(friend.id, friend);
        });
      });
    },
    async refreshBlocked(): Promise<void> {
      return friendApi.fetchBlocked().then((users) => {
        users.forEach((user: User) => {
          this.blockedMap.set(user.id, user);
        });
      });
    },
  },
});
