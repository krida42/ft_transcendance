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
        console.log("channels: ", channels);
        this.myChannels.clear();
        channels.forEach((channel: Channel) => {
          this.myChannels.set(channel.chanId, channel);
        });
      });
    },
    async createChannel(channel: Channel): Promise<Channel> {
      return channelsApi.createChannel(channel).then((channel) => {
        this.myChannels.set(channel.chanId, channel);
        return channel;
      });
    },
    async deleteChannel(chanId: Id): Promise<void> {
      return channelsApi.deleteChannel(chanId).then(() => {
        this.myChannels.delete(chanId);
      });
    },
    async editChannel(channel: Channel, chanId: string): Promise<Channel> {
      return channelsApi.editChannel(channel, chanId).then((channel) => {
        this.myChannels.set(chanId, channel);
        return channel;
      });
    },
    async leaveChannel(chanId: Id): Promise<void> {
      return channelsApi.leaveChannel(chanId).then(() => {
        this.myChannels.delete(chanId);
      });
    },
    async joinChannel(chanId: Id): Promise<Channel> {
      return channelsApi.joinChannel(chanId).then((channel) => {
        this.myChannels.set(channel.chanId, channel);
        return channel;
      });
    },
    async joinProtectedChannel(chanId: Id, password: string): Promise<Channel> {
      return channelsApi
        .joinProtectedChannel(chanId, password)
        .then((channel) => {
          this.myChannels.set(channel.chanId, channel);
          return channel;
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
    async refreshInvites(chanId: Id): Promise<void> {
      return channelsApi.fetchChannelInvites(chanId).then((users) => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.invites = [];
          for (const user of users) {
            channel.invites.push(user.id);
          }
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
        this.refreshBans(chanId);
      });
    },
    async unbanUser(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.unbanUser(chanId, userId).then(() => {
        this.refreshBans(chanId);
      });
    },
    async kickUser(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.kickUser(chanId, userId).then(() => {
        this.refreshMembers(chanId);
      });
    },
    async addAdmin(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.addAdmin(chanId, userId).then(() => {
        this.refreshAdmins(chanId);
      });
    },
    async removeAdmin(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.removeAdmin(chanId, userId).then(() => {
        this.refreshAdmins(chanId);
      });
    },
    async inviteUser(chanId: Id, userId: Id): Promise<void> {
      return channelsApi.inviteUser(chanId, userId).then(() => {
        this.refreshInvites(chanId);
      });
    },

    async uploadChannelLogo(chanId: Id, file: File): Promise<void> {
      return channelsApi.uploadChannelLogo(chanId, file).then((url) => {
        const channel = this.myChannels.get(chanId);
        if (channel) {
          channel.imgName = url;
        }
      });
    },
  },
});
