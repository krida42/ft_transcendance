<template>
  <ul
    class="nnw-[264px] w-[230px] h-64 bd-redd overflow-y-auto rounded-2xl scrollbar-styling"
  >
    <ChatAccessItem
      v-for="(friend, index) in [...friendStore.friends.values()]"
      :key="friend.id"
      :title="friend.pseudo"
      :chat-id="friend.id"
      @click="openAndRefreshChat(friend.id, friend.pseudo)"
      :start="index === 0 && true"
      :end="index === friendStore.friends.size - 1 && true"
    />
    <!-- <ChatAccessItem
      key="marine"
      title="Marine"
      chat-id="marine"
      @click="openAndRefreshChat('marine', 'Marine')"
    /> -->
    <!-- <ChatAccessItem
      key="someone"
      title="Someone"
      chat-id="someone"
      @click="openAndRefreshChat('someone', 'Someone')"
    /> -->
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

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb {
  // background-color: darkgrey;
  background-color: $green-dark;
  border-radius: 9999px;
  // outline: 1px solid slategrey;
}
// .scrollbar-styling {
//   scrollbar-width: thin;
//   scrollbar-color: red;
// }
</style>
