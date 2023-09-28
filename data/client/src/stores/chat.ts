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
    openedChatId: "1",
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
      chat?.messages.set(message.msgId, message);
      console.log("pushing message to chat: ", message);
    },
    refreshChat(chatId: Id, chatType: ChatType) {
      const fetchFn =
        chatType === ChatType.Direct
          ? messageApi.fetchDirectMsgs
          : messageApi.fetchChannelMsgs;

      fetchFn(chatId, null).then((resMsgs) => {
        resMsgs.forEach((message: any) => {
          message.createdAt = new Date(Number(message.createdAt));
          this.addMessageToStore(chatId, message);
        });
      });
    },
  },
});
