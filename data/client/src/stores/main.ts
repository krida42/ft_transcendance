import { defineStore } from "pinia";

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    loggedIn: false,
    userInfo: {
      email: "koko@gmail.com",
      pseudo: "koko",
      id: "a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57",
      displayName: "Kokorico",
    },
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
