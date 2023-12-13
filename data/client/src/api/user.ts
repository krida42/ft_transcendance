import axios from "axios";
import { User } from "../types";

// const host = process.env.VUE_APP_API_URL;
const host = "http://localhost:3001";

export default {
  async fetchUser(userId: string) {
    return axios.get(`${host}/users/${userId}`).then((res) => res.data);
  },

  async fetchUserStatus(userId: string) {
    const res = await axios.get(`${host}/users/${userId}/status`);
    return res.data;
  },
  async fetchUserByPseudo(pseudo: string) {
    return axios
      .get(`${host}/users`, {
        params: { pseudo: pseudo },
      })
      .then((res) => ({ ...res.data, id: res.data.id }));
  },
  async editUser(user: User) {
    const res = await axios.patch(`${host}/users`, user);
    return res.data;
  },
};
