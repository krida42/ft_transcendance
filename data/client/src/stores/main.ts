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
      id: "a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57",
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
