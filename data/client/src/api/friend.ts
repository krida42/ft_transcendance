import axios from "axios";

const host = process.env.VUE_APP_API_URL;

export default {
  async fetchFriendList(): Promise<Friend[]> {
    return axios.get(`${host}/friends`).then((res) => res.data);
  },
};
