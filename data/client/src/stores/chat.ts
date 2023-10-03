import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import messageApi from "../api/message";

enum ChatType {
  Channel = "channel",
  Direct = "direct",
}

export const useChatStore = defineStore({
  id: "chat",
  state: (): {
    openedChatId: Id;
    chats: Map<Id, Chat>;
  } => ({
    openedChatId: "marine",
    chats: new Map<Id, Chat>(),
  }),
  getters: {
    currentChat(state) {
      return state.chats.get(state.openedChatId);
    },
  },
  actions: {
    createChatIfNotExist(id: Id, name: string) {
      if (!this.chats.has(id)) {
        this.chats.set(id, {
          id,
          name,
          messages: new Map<Id, Message>(),
        });
      }
    },
    openChat(chatId: Id) {
      this.createChatIfNotExist(chatId, "someone");
      this.openedChatId = chatId;
    },
    addMessageToStore(chatId: Id, message: Message) {
      this.createChatIfNotExist(chatId, "someone");
      const chat = this.chats.get(chatId);
      // if (!chat) throw new Error("chat not found");
      chat?.messages.set(message.msgId, message);
      console.log("pushing message to chat: ", message);
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
      chat.messages.set(remoteMsgId, msg);
      chat.messages.delete(localMsgId);
    },
    refreshChat(chatId: Id, chatType: ChatType, beforeMessageId: Id | null) {
      const fetchFn =
        chatType === ChatType.Direct
          ? messageApi.fetchDirectMsgs
          : messageApi.fetchChannelMsgs;

      fetchFn(chatId, beforeMessageId).then((resMsgs) => {
        resMsgs.forEach((message: any) => {
          message.createdAt = new Date(Number(message.createdAt));
          this.addMessageToStore(chatId, message);
        });
      });
    },
    sendMessage(chatId: Id, chatType: ChatType, content: string) {
      const postFn =
        chatType === ChatType.Direct
          ? messageApi.postDirectMsg
          : messageApi.postChannelMsg;
      const localMsg: Message = {
        msgId: "local" + Math.floor(Math.random() * 1000000),
        content,
        createdAt: new Date(),
        userId: useUsersStore().currentUser.id,
        ack: false,
      };
      this.addMessageToStore(chatId, localMsg);
      postFn(chatId, content).then((resMsg) => {
        resMsg.createdAt = new Date(Number(resMsg.createdAt));
        this.updateMsgAck(chatId, true, localMsg.msgId, resMsg.remoteMsgId);
      });
    },
  },
});
