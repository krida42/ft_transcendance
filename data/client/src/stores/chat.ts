import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import messageApi from "../api/message";
import { MessageTransformer } from "@/utils/messageTransformer";

import { Chat, ChatType, Id, Message } from "@/types";
import { v4 } from "uuid";
import { AxiosError } from "axios";

export const useChatStore = defineStore({
  id: "chat",
  state: (): {
    openedChatId: Id;
    chats: Map<Id, Chat>;
  } => ({
    openedChatId: "",
    chats: new Map<Id, Chat>(),
  }),
  getters: {
    currentChat(state) {
      return state.chats.get(state.openedChatId);
    },
  },
  actions: {
    createChatIfNotExist(id: Id, name: string, chatType: ChatType) {
      if (!this.chats.has(id)) {
        this.chats.set(id, {
          id,
          name,
          messages: new Map<Id, Message>(),
          chatType,
        });
      }
    },
    openChat(chatId: Id) {
      this.createChatIfNotExist(chatId, "someone", ChatType.Direct);
      this.openedChatId = chatId;
    },
    addMessageToStore(chatId: Id, message: Message) {
      const usersStore = useUsersStore();
      // this.createChatIfNotExist(chatId, "someone", ChatType.Direct);
      const chat = this.chats.get(chatId);
      if (!chat) throw new Error("chat not found");
      chat?.messages.set(message.msgId, message);
      if (!usersStore.users.has(message.userId)) {
        usersStore.refreshUser(message.userId);
      }
      // console.log("pushing message to chat: ", message);
    },
    updateMsgAck(
      chatId: Id,
      ack: boolean,
      localMsgId: Id,
      remoteMsgId: Id | null
    ) {
      const chat = this.chats.get(chatId);
      if (!chat) throw new Error("chat not found");
      const msg = chat.messages.get(localMsgId);
      if (!msg) throw new Error("message not found");
      msg.ack = ack;
      if (remoteMsgId) msg.msgId = remoteMsgId;
      else return;
      msg.vueTrackId = localMsgId;
      chat.messages.set(remoteMsgId, msg);
      chat.messages.delete(localMsgId);
    },
    async refreshChat(
      chatId: Id,
      chatType: ChatType,
      beforeMessageId: Id | null
    ) {
      const usersStore = useUsersStore();
      console.log("refreshing chat", chatId, chatType, beforeMessageId);
      const fetchFn =
        chatType === ChatType.Direct
          ? messageApi.fetchDirectMsgs
          : messageApi.fetchChannelMsgs;

      return fetchFn(chatId, beforeMessageId).then((resMsgs) => {
        console.log("resMsgs", resMsgs);
        resMsgs.forEach(async (message: any) => {
          // message.createdAt = new Date(Number(message.createdAt));
          // message.createdAt = new Date(message.createdAt);
          message.createdAt = Number.isNaN(Date.parse(message.createdAt))
            ? new Date(Number(message.createdAt))
            : new Date(message.createdAt);
          this.addMessageToStore(chatId, message);
          if (!usersStore.users.has(message.userId)) {
            console.log("il est pas la", message.userId);
          } else {
            console.log("il est la", message.userId);
          }
        });
        const msgsUserIds = resMsgs.map((msg: Message) => msg.userId);
        const uniqueUserIds = [...new Set(msgsUserIds)];
        const missingUserIds = uniqueUserIds.filter(
          (userId) => !usersStore.users.has(userId as string)
        );
        missingUserIds.forEach((userId) =>
          usersStore.refreshUser(userId as string)
        );
      });
    },

    async loadMoreMessages() {
      const chat = this.currentChat;
      if (!chat) throw new Error("chat not found");
      const beforeMessageId = chat.messages.size
        ? MessageTransformer.sortByDate(
            MessageTransformer.toArray(chat.messages)
          )[0].msgId
        : null;
      return this.refreshChat(chat.id, chat.chatType, beforeMessageId);
    },
    async sendMessage(chatId: Id, chatType: ChatType, content: string) {
      const postFn =
        chatType === ChatType.Direct
          ? messageApi.postDirectMsg
          : messageApi.postChannelMsg;
      const localMsg: Message = {
        msgId: v4(),
        content,
        createdAt: new Date(),
        userId: useUsersStore().currentUser.id,
        ack: false,
      };
      this.addMessageToStore(chatId, localMsg);
      postFn(chatId, content, localMsg.msgId)
        .then((resMsg) => {
          resMsg.createdAt = new Date(Number(resMsg.createdAt));
          this.updateMsgAck(chatId, true, localMsg.msgId, resMsg.remoteMsgId);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 403) {
            console.log("403 Forbidden, You are muted");
          }
        });
    },
  },
});
