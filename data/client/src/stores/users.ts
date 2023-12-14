import { defineStore } from "pinia";
import { useMainStore } from "./main";
import { useFriendStore } from "./friend";
import userApi from "../api/user";

import { Id, User } from "@/types";

export const useUsersStore = defineStore({
  id: "users",
  state: (): {
    usersMap: Map<Id, User>;
  } => ({
    usersMap: new Map<Id, User>(),
  }),
  getters: {
    users: (state) =>
      new Map<Id, User>([
        // ...useFriendStore().DEBUG_friendsStatusRand,
        ...useFriendStore().friends,
        ...useFriendStore().friendsReceived,
        ...useFriendStore().friendsSent,
        ...useFriendStore().blocked,
        ...state.usersMap,
      ]),

    currentUser: (state): User => {
      void state;
      const mainStore = useMainStore();
      return {
        id: mainStore.userInfo.id,
        pseudo: mainStore.userInfo.pseudo,
        login: mainStore.userInfo.login,
        avatar: mainStore.userInfo.avatar,
      };
    },
  },
  actions: {
    refreshUser(userId: string) {
      userApi.fetchUser(userId).then((user) => {
        this.usersMap.set(user.id, user);
      });
    },
    editUser(user: any) {
      userApi.editUser(user).then((user) => {
        this.usersMap.set(user.id, user);
      });
    },
    uploadUserAvatar(file: File) {
      userApi.uploadUserAvatar(file).then((fileUrl) => {
        this.currentUser.avatar = fileUrl;
      });
    },
  },
});
