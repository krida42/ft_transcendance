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

    currentChatMessagesSubstituted(state): Chat | undefined {
      const usersStore = useUsersStore();
      const currentChat = this.currentChat as Chat | undefined;
      if (!currentChat) {
        return undefined;
      }
      const substitutedMessages = new Map<Id, Message>();

      currentChat.messages.forEach((message) => {
        // const user = usersStore.users.find(
        //   (user) => user.id === message.userId
        // );
        const user = usersStore.users.get(message.userId);
        substitutedMessages.set(message.msgId, {
          ...message,
          userPseudo: user?.pseudo,
          userDisplayName: user?.displayName,
          userAvatar: user?.avatar,
        });
      });
      return {
        ...currentChat,
        messages: substitutedMessages,
      };
    },
    // currentChatMsgsSubstSorted(state): Message[] | undefined {
    //   const currentChat = this.currentChatMessagesSubstituted;
    //   if (!currentChat) return undefined;
    //   const msgs = Array.from(currentChat.messages.values());
    //   return msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    // },
    currentChatMsgsArray(state): Message[] {
      const chat = this.currentChatMessagesSubstituted;
      if (!chat) return [];
      return Array.from(chat.messages.values());
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
