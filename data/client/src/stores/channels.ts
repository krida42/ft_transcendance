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
    Channels: (state) => new Map<Id, Channel>(state.myChannels),
    myChannelsList: (state) => {
      const myChannels: Channel[] = [];
      state.myChannels.forEach((channel) => {
        myChannels.push(channel);
      });
      return myChannels;
    },
    channel: (state) => (channelId: Id) => state.myChannels.get(channelId),
    isOwner: (state) => (channelId: Id, userId: Id) => {
      const channel = state.myChannels.get(channelId);
      if (!channel) return false;
      return channel.owner.id === userId;
    },
    isBanned: (state) => (channelId: Id, userId: Id) => {
      const channel = state.myChannels.get(channelId);
      if (!channel) return false;
      return channel.bans.some((user) => user.id === userId);
    },
    isAdmin: (state) => (channelId: Id, userId: Id) => {
      const channel = state.myChannels.get(channelId);
      if (!channel) return false;
      return channel.admins.some((user) => user.id === userId);
    },
  },
  actions: {
    async refreshChannels(): Promise<void> {
      return channelsApi.fetchMyChannels().then((channels) => {
        channels.forEach((channel: Channel) => {
          this.myChannels.set(channel.id, channel);
        });
      });
    },
    async createChannel(channel: Channel): Promise<void> {
      return channelsApi.createChannel(channel).then((channel) => {
        this.myChannels.set(channel.id, channel);
      });
    },
    async deleteChannel(channelId: Id): Promise<void> {
      return channelsApi.deleteChannel(channelId).then(() => {
        this.myChannels.delete(channelId);
      });
    },
    async leaveChannel(channelId: Id, userId: Id): Promise<void> {
      return channelsApi.leaveChannel(channelId).then(() => {
        const channel = this.myChannels.get(channelId);
        if (channel) {
          channel.members = channel.members.filter(
            (user) => user.id !== userId
          );
        }
      });
    },
  },
});
