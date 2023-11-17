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
    async acceptFriendRequest(id: Id): Promise<void> {
      return friendApi.acceptFriendRequest(id).then(() => {
        this.friendsMap.set(id, this.friendsReceivedMap.get(id)!);
        this.friendsReceivedMap.delete(id);
      });
    },
    async declineFriendRequest(id: Id): Promise<void> {
      return friendApi.declineFriendRequest(id).then(() => {
        this.friendsReceivedMap.delete(id);
      });
    },
    async blockUser(id: Id): Promise<void> {
      return friendApi.blockUser(id).then(() => {
        this.friendsMap.delete(id);
        this.friendsReceivedMap.delete(id);
        this.friendsSentMap.delete(id);
        this.blockedMap.set(id, this.friendsMap.get(id)!);
      });
    },
    async unblockUser(id: Id): Promise<void> {
      return friendApi.unblockUser(id).then(() => {
        this.blockedMap.delete(id);
      });
    },
    async deleteFriend(id: Id): Promise<void> {
      return friendApi.deleteFriend(id).then(() => {
        this.friendsMap.delete(id);
      });
    },
    async sendFriendRequest(id: Id): Promise<void> {
      return friendApi.sendFriendRequest(id).then((user) => {
        this.friendsSentMap.set(user.id, user);
      });
    },
    async cancelFriendRequest(id: Id): Promise<void> {
      return friendApi.cancelFriendRequest(id).then(() => {
        this.friendsSentMap.delete(id);
      });
    },
  },
});
