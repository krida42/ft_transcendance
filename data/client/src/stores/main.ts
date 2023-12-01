import { defineStore } from "pinia";
import { User, Status } from "@/types";

export const useMainStore = defineStore({
  id: "main",
  state: (): {
    loggedIn: boolean;
    userInfo: User;
    status: Status;
  } => ({
    loggedIn: false,
    userInfo: {
      email: "koko@gmail.com",
      pseudo: "koko",
      id: "kevin",
      login: "Kokorico",
      avatar: "https://i.pravatar.cc/300",
    },
    status: Status.Offline,
  }),
  getters: {},
  actions: {
    login() {
      this.loggedIn = true;
    },
    logout() {
      this.loggedIn = false;
    },
  },
});
