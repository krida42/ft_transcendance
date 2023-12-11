import { defineStore } from "pinia";
import channelsApi from "../api/channel";
import { Channel, Id } from "@/types";

export const useChannelsStore = defineStore({
  id: "channels",
  state: (): {
    myChannels: Map<Id, Channel>;
  } => ({
    myChannels: new Map<Id, Channel>(),
  }),
  getters: {
    myChannelsList: (state) => {
      const myChannels: Channel[] = [];
      state.myChannels.forEach((channel) => {
        myChannels.push(channel);
      });
      return myChannels;
    },
    channel: (state) => (chanId: Id) => state.myChannels.get(chanId),
    isOwner: (state) => (chanId: Id, userId: Id) => {
      const channel = state.myChannels.get(chanId);
      if (!channel) return false;
      return channel.ownerId === userId;
    },
    isBanned: (state) => (chanId: Id, userId: Id) => {
      const channel = state.myChannels.get(chanId);
      if (!channel) return false;
      if (!channel.bans) return false;
      return channel.bans.some((user) => user.id === userId);
    },
    isAdmin: (state) => (chanId: Id, userId: Id) => {
      const channel = state.myChannels.get(chanId);
      if (!channel) return false;
      if (!channel.admins) return false;
      return channel.admins.some((user) => user.id === userId);
    },
  },
  actions: {
    async refreshChannels(): Promise<void> {
      return channelsApi.fetchMyChannels().then((channels) => {
        channels.forEach((channel: Channel) => {
          this.myChannels.set(channel.chanId, channel);
        });
      });
    },
    async createChannel(channel: Channel): Promise<void> {
      return channelsApi.createChannel(channel).then((channel) => {
        this.myChannels.set(channel.chanId, channel);
      });
    },
    async deleteChannel(chanId: Id): Promise<void> {
      return channelsApi.deleteChannel(chanId).then(() => {
        this.myChannels.delete(chanId);
      });
    },
    async leaveChannel(chanId: Id): Promise<void> {
      return channelsApi.leaveChannel(chanId).then(() => {
        this.myChannels.delete(chanId);
      });
    },
    async joinChannel(chanId: Id): Promise<void> {
      return channelsApi.joinChannel(chanId).then((channel) => {
        this.myChannels.set(channel.chanId, channel);
      });
    },
    async refreshMembers(chanId: Id): Promise<void> {
      return channelsApi.fetchChannelMembers(chanId).then((users) => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.members = users;
        }
      });
    },
    async refreshAdmins(chanId: Id): Promise<void> {
      return channelsApi.fetchChannelAdmins(chanId).then((users) => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.admins = users;
        }
      });
    },
    async refreshBans(chanId: Id): Promise<void> {
      return channelsApi.fetchBannedUsers(chanId).then((users) => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.bans = users;
        }
      });
    },
    async banUser(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.banUser(chanId, userId).then(() => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.bans.push(
            channel.members.find((user) => user.id === userId)!
          );
          channel.members = channel.members.filter(
            (user) => user.id !== userId
          );
        }
      });
    },
    async unbanUser(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.unbanUser(chanId, userId).then(() => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.bans = channel.bans.filter((user) => user.id !== userId);
        }
      });
    },
    async kickUser(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.kickUser(chanId, userId).then(() => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.members = channel.members.filter(
            (user) => user.id !== userId
          );
        }
      });
    },
    async addAdmin(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.addAdmin(chanId, userId).then(() => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.admins.push(
            channel.members.find((user) => user.id === userId)!
          );
        }
      });
    },
    async removeAdmin(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.removeAdmin(chanId, userId).then(() => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.admins = channel.admins.filter((user) => user.id !== userId);
        }
      });
    },
  },
});
