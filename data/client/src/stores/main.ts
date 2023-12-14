import { defineStore } from "pinia";
import {
  User,
  Status,
  UserResponse,
  MyUserResponse,
  MyUserResponseSchema,
} from "@/types";
import { UserResponseSchema } from "@/types";
import userApi from "@/api/user";
import { AxiosError } from "axios";

export const useMainStore = defineStore({
  id: "main",
  state: (): {
    loggedIn: boolean;
    userInfo: User;
    status: Status;
  } => ({
    loggedIn: false,
    userInfo: {
      id: "",
      pseudo: "",
      avatar: "",
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
    async refreshUserInfo() {
      return userApi
        .fetchUser("me")
        .then((user: MyUserResponse) => {
          console.log("user", user);
          // const { public_id, login, pseudo, avatar, email, phone, roles } =
          // MyUserResponseSchema.parse(user);
          // this.userInfo = {
          //   id: public_id,
          //   login,
          //   pseudo,
          //   avatar,
          //   email,
          //   phone,
          //   roles,
          // };
          this.userInfo = MyUserResponseSchema.parse(user);
          this.login();
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            this.logout();
            console.log("Tu n est pas connecté pour recuperer tes infos");
          }
        });
    },
  },
});
