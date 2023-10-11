<template>
  <ul class="w-[264px] h-64">
    <ChatAccessItem
      v-for="[, friend] in friendStore.friends"
      :key="friend.id"
      :title="friend.pseudo"
      :chat-id="friend.id"
      @click="openAndRefreshChat(friend.id, friend.pseudo)"
    />
    <ChatAccessItem
      key="marine"
      title="Marine"
      chat-id="marine"
      @click="openAndRefreshChat('marine', 'Marine')"
    />
    <!-- same but with id=someone -->
    <ChatAccessItem
      key="someone"
      title="Someone"
      chat-id="someone"
      @click="openAndRefreshChat('someone', 'Someone')"
    />
  </ul>
</template>

<script setup lang="ts">
import ChatAccessItem from "./ChatAccessItem.vue";
import { useFriendStore } from "@/stores/friend";
import { useChatStore } from "@/stores/chat";
import { ChatType } from "@/mtypes";

const friendStore = useFriendStore();
const chatStore = useChatStore();

function openAndRefreshChat(chatId: string, chatName: string) {
  chatStore.createChatIfNotExist(chatId, chatName, ChatType.Direct);
  chatStore.openChat(chatId);
  chatStore.refreshChat(chatId, ChatType.Direct, null);
}
</script>
