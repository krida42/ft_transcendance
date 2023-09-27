import { defineStore } from "pinia";
import { useMainStore } from "./main";
import userApi from "../api/user";
import user from "../api/user";

export const useUsersStore = defineStore({
  id: "users",
  state: (): {
    users: Map<Id, User>;
  } => ({
    users: new Map<Id, User>(),
  }),
  getters: {
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
        this.users.set(user.id, user);
      });
    },
  },
});
