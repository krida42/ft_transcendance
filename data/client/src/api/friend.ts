import axios from "axios";

import { Friend, Id, User } from "@/types";

// const host = process.env.VUE_APP_API_URL;
const host = "http://localhost:3001";

export default {
  async fetchFriendList(): Promise<Friend[]> {
    console.log("cuicui: ", host);
    console.log("heyhey: ", process.env);
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

  async acceptFriendRequest(id: Id): Promise<void> {
    return axios.patch(`${host}/friends/${id}/accept`).then((res) => res.data);
  },
  //prettier-ignore
  async declineFriendRequest(id: Id): Promise<void> {
    return axios.delete(`${host}/friends/${id}/decline`).then((res) => res.data);
  },
  async sendFriendRequest(id: Id): Promise<any> {
    //it returns a user
    return axios.post(`${host}/friends/${id}/add`).then((res) => res.data);
  },
  async cancelFriendRequest(id: Id): Promise<void> {
    return axios.delete(`${host}/friends/${id}/cancel`).then((res) => res.data);
  },

  async blockUser(id: Id): Promise<void> {
    return axios.post(`${host}/friends/${id}/block`).then((res) => res.data);
  },
  //prettier-ignore
  async unblockUser(id: Id): Promise<void> {
    return;
    return axios.delete(`${host}/friends/${id}/unblock`).then((res) => res.data);
  },

  async deleteFriend(id: Id): Promise<void> {
    return;
    return axios.delete(`${host}/friends/${id}`).then((res) => res.data);
  },
};
