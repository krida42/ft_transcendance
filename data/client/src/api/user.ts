import axios from "axios";

const host = process.env.VUE_APP_API_URL;

export default {
  async fetchUser(userId: string) {
    const res = await axios.get(`${host}/users/${userId}`);
    return res.data;
  },

  async fetchUserStatus(userId: string) {
    const res = await axios.get(`${host}/users/${userId}/status`);
    return res.data;
  },
};
