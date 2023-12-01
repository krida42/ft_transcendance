import axios from "axios";

import { Channel, Id } from "@/types";

// const host = process.env.VUE_APP_API_URL;
const host = "http://localhost:3001";

export default {
  async fetchChannel(channelId: string) {
    const res = await axios.get(`${host}/channels/${channelId}`);
    return res.data;
  },

  async fetchChannels(page: number) {
    const res = await axios.get(`${host}/channels`, { params: { page } });
    return res.data;
  },

  async fetchMyChannels() {
    const res = await axios.get(`${host}/channels/my-channels`);
    return res.data;
  },

  async createChannel(channel: Channel) {
    const res = await axios.post(`${host}/channels`, channel);
    return res.data;
  },

  async deleteChannel(channelId: Id) {
    const res = await axios.delete(`${host}/channels/${channelId}`);
    return res.data;
  },

  async removeUserFromChannel(channelId: Id) {
    const res = await axios.delete(`${host}/channels/${channelId}/quit}`);
    return res.data;
  },
};
