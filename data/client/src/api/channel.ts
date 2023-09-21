import axios from "axios";

const host = process.env.VUE_APP_API_URL;

function fetchChannel(channelId: string) {
  return axios.get(`${host}/channels/${channelId}`).then((res) => res.data);
}

function fetchChannels(page: number) {
  return axios
    .get(`${host}/channels`, { params: { page } })
    .then((res) => res.data);
}
