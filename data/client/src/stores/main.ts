import { defineStore } from "pinia";

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    loggedIn: false,
    userInfo: {
      email: "koko@gmail.com",
      pseudo: "koko",
      id: "kevin",
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
