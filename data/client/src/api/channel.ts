import axios from "axios";

const host = process.env.VUE_APP_API_URL;

export default {
  async fetchChannel(channelId: string) {
    const res = await axios.get(`${host}/channels/${channelId}`);
    return res.data;
  },

  async fetchChannels(page: number) {
    const res = await axios.get(`${host}/channels`, { params: { page } });
    return res.data;
  },
};
