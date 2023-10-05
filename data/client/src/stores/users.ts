import { defineStore } from "pinia";
import { useMainStore } from "./main";
import { useFriendStore } from "./friend";
import userApi from "../api/user";

export const useUsersStore = defineStore({
  id: "users",
  state: (): {
    usersMap: Map<Id, User>;
  } => ({
    usersMap: new Map<Id, User>(),
  }),
  getters: {
    users: (state) =>
      new Map<Id, User>([...state.usersMap, ...useFriendStore().friends]),
    getUserNameById(state) {
      return (id: string) => {
        const user = this.users.get(id);
        return user?.displayName || "Unknown";
      };
    },
    currentUser: (state) => {
      const mainStore = useMainStore();
      return {
        id: mainStore.userInfo.id,
        pseudo: mainStore.userInfo.pseudo,
        displayName: mainStore.userInfo.displayName,
      };
    },
  },
  actions: {
    refreshUser(userId: string) {
      userApi.fetchUser(userId).then((user) => {
        this.usersMap.set(user.id, user);
      });
    },
  },
});
