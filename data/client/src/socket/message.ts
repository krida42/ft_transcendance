import { socket } from "./index";
import { useChatStore } from "@/stores/chat";
import {
  ChatType,
  Message,
  MessageResponse,
  MessageResponseSchema,
} from "@/types";
import { useUsersStore } from "@/stores/users";
import { useChannelsStore } from "@/stores/channels";
import { useFriendStore } from "@/stores/friend";

const chatStore = useChatStore();
const usersStore = useUsersStore();
const channelsStore = useChannelsStore();
const friendStore = useFriendStore();

socket.on("messageDirect", async (data) => {
  MessageResponseSchema.parse(data);
  data.createdAt = new Date(data.createdAt);
  let sender = usersStore.users.get(data.userId);
  if (!sender) await friendStore.refreshFriendList();
  sender = usersStore.users.get(data.userId);
  if (!sender) throw new Error("sender not found");

  chatStore.createChatIfNotExist(data.userId, sender.pseudo, ChatType.Direct);
  chatStore.addMessageToStore(data.userId, data);
});

socket.on("messageChannel", async (data) => {
  MessageResponseSchema.parse(data);
  if (data.channelId === undefined) throw new Error("channelId is undefined");
  data.createdAt = new Date(data.createdAt);
  let channel = channelsStore.myChannels.get(data.channelId);
  if (!channel) await channelsStore.refreshChannels();
  channel = channelsStore.myChannels.get(data.channelId);
  if (!channel) throw new Error("channel not found");

  chatStore.createChatIfNotExist(
    channel.chanId,
    channel.chanName,
    ChatType.Channel
  );

  const msg: Message = {
    content: data.content,
    createdAt: data.createdAt,
    msgId: data.msgId,
    userId: data.userId,
  };
  chatStore.addMessageToStore(channel.chanId, msg);
});
