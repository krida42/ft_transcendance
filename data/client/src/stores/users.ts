import { defineStore } from "pinia";
import { useMainStore } from "./main";

export const useUsersStore = defineStore({
  id: "users",
  state: (): {
    friends: Friend[];
  } => ({
    friends: [],
  }),
  getters: {
    users(state) {
      const me = this.me;
      const user: User = {
        id: me.id,
        pseudo: me.pseudo,
        displayName: me.displayName,
      };
      return state.friends.concat(user);
    },
    getUserNameById(state) {
      return (id: string) => {
        const user = this.users.find((user) => user.id === id);
        return user?.displayName || "Unknown";
      };
    },
    me: (state) => {
      const mainStore = useMainStore();
      return mainStore.userInfo;
    },
  },
  actions: {
    setFriends(friends: Friend[]) {
      this.friends = friends;
    },
  },
});
