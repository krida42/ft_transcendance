import { defineStore } from "pinia";
import channelsApi from "../api/channel";
import { Channel, Id } from "@/types";

export const useChannelsStore = defineStore({
  id: "channels",
  state: (): {
    channels: Map<Id, Channel>;
  } => ({
    channels: new Map<Id, Channel>(),
  }),
  getters: {
    channels: (state) => new Map<Id, Channel>(state.channels),
  },
  actions: {
    async refreshChannels(): Promise<void> {
      return channelsApi.fetchMyChannels().then((channels) => {
        channels.forEach((channel: Channel) => {
          this.channels.set(channel.id, channel);
        });
      });
    },
    async createChannel(channel: Channel): Promise<void> {
      return channelsApi.createChannel(channel).then((channel) => {
        this.channels.set(channel.id, channel);
      });
    },
    async deleteChannel(channelId: Id): Promise<void> {
      return channelsApi.deleteChannel(channelId).then(() => {
        this.channels.delete(channelId);
      });
    },
    async removeUserFromChannel(channelId: Id, userId: Id): Promise<void> {
      return channelsApi.removeUserFromChannel(channelId).then(() => {
        const channel = this.channels.get(channelId);
        if (channel) {
          channel.members = channel.members.filter(
            (user) => user.id !== userId
          );
        }
      });
    },
  },
});
