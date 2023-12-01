import axios from "axios";

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
      .then((res) => ({ ...res.data, id: res.data.public_id }));
  },
};
