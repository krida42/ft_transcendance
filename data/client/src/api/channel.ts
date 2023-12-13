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
    const res = await axios.get(`${host}/channels`, {
      params: { page },
    });
    return res.data;
  },

  async fetchMyChannels() {
    const res = await axios.get(`${host}/channels-joined`);
    return res.data;
  },

  async fetchAvailableChannels() {
    const res = await axios.get(`${host}/channels-available`);
    return res.data;
  },

  async fetchUnjoinedProtectedChannels() {
    const res = await axios.get(`${host}/channels-unjoined-protect`);
    return res.data;
  },

  async fetchChannelMembers(channelId: string) {
    const res = await axios.get(`${host}/channels/${channelId}/users`);
    return res.data;
  },

  async fetchChannelAdmins(channelId: string) {
    const res = await axios.get(`${host}/channels/${channelId}/admins`);
    return res.data;
  },

  async fetchChannelInvites(channelId: string) {
    const res = await axios.get(`${host}/channels/${channelId}/invites`);
    return res.data;
  },

  async fetchBannedUsers(channelId: string) {
    const res = await axios.get(`${host}/channels/${channelId}/bans`);
    return res.data;
  },

  async createChannel(channel: Channel): Promise<Channel> {
    const res = await axios.post(`${host}/channels`, channel);
    return res.data;
  },

  async deleteChannel(channelId: Id) {
    const res = await axios.delete(`${host}/channels/${channelId}`);
    return res.data;
  },

  async editChannel(channel: Channel, chanId: string): Promise<Channel> {
    const res = await axios.patch(`${host}/channels/${chanId}`, channel);
    return res.data;
  },

  async leaveChannel(channelId: Id) {
    const res = await axios.delete(`${host}/channels/${channelId}/quit`);
    return res.data;
  },

  async joinChannel(channelId: Id): Promise<Channel> {
    const res = await axios.post(`${host}/channels/${channelId}/join`);
    return res.data;
  },

  async joinProtectedChannel(
    channelId: Id,
    chanPassword: string
  ): Promise<Channel> {
    const res = await axios.post(`${host}/channels/${channelId}/join`, {
      chanPassword,
    });
    return res.data;
  },

  async banUser(channelId: Id, userId: Id) {
    const res = await axios.post(`${host}/channels/${channelId}/ban/${userId}`);
    return res.data;
  },

  async unbanUser(channelId: Id, userId: Id) {
    const res = await axios.delete(
      `${host}/channels/${channelId}/ban/${userId}`
    );
    return res.data;
  },

  async kickUser(channelId: Id, userId: Id) {
    const res = await axios.delete(
      `${host}/channels/${channelId}/kick/${userId}`
    );
    return res.data;
  },

  async addAdmin(channelId: Id, userId: Id) {
    const res = await axios.post(
      `${host}/channels/${channelId}/admin/${userId}`
    );
    return res.data;
  },

  async removeAdmin(channelId: Id, userId: Id) {
    const res = await axios.delete(
      `${host}/channels/${channelId}/admin/${userId}`
    );
    return res.data;
  },

  async inviteUser(channelId: Id, userId: Id) {
    const res = await axios.post(
      `${host}/channels/${channelId}/invite/${userId}`
    );
    return res.data;
  },

  async uploadChannelLogo(channelId: Id, file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${host}/channels/${channelId}/image`,
        formData
      );
      console.log("CHANNEL LOGO server response:", res.data);
      return res.data;
    } catch (error) {
      console.error("CHANNEL LOGO error:", error);
      throw error;
    }
  },
};
