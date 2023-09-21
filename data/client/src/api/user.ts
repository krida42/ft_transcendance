import axios from "axios";

const host = process.env.VUE_APP_API_URL;

function fetchUser(userId: string) {
  return axios.get(`${host}/users/${userId}`).then((res) => res.data);
}

function fetchUserStatus(userId: string) {
  return axios.get(`${host}/users/${userId}/status`).then((res) => res.data);
}
