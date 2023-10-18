import axios from "axios";

const host = process.env.VUE_APP_API_URL;

export default {
  async fetchFriendList(): Promise<Friend[]> {
    return axios.get(`${host}/friends`).then((res) => res.data);
  },
  async fetchFriendsReceived(): Promise<Friend[]> {
    return axios.get(`${host}/friends-received`).then((res) => res.data);
  },
  async fetchFriendsSent(): Promise<Friend[]> {
    return axios.get(`${host}/friends-sent`).then((res) => res.data);
  },
  async fetchBlocked(): Promise<User[]> {
    return axios.get(`${host}/blocked`).then((res) => res.data);
  },
};
