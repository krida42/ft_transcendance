import { defineStore } from "pinia";
import { useUsersStore } from "./users";

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

    currentChatMessagesSubstituted(state): Message[] {
      const usersStore = useUsersStore();
      const currentChat = this.currentChat as Chat | undefined;
      if (!currentChat) {
        return [];
      }
      return currentChat.messages.map((message) => {
        const user = usersStore.users.find(
          (user) => user.id === message.userId
        );
        return {
          ...message,
          userPseudo: user?.pseudo,
          userDisplayName: user?.displayName,
        };
      });
    },
  },
  actions: {
    createChatIfNotExist(id: Id, name: string) {
      if (!this.chats.has(id)) {
        this.chats.set(id, {
          id,
          name,
          messages: [],
        });
      }
    },
    openChat(chatId: Id) {
      this.createChatIfNotExist(chatId, "someone");
      this.openedChatId = chatId;
    },
    addMessage(chatId: Id, message: Message) {
      this.createChatIfNotExist(chatId, "someone");
      const chat = this.chats.get(chatId);
      chat?.messages.push(message);
      console.log("pushing message to chat: ", message);
    },
  },
});
