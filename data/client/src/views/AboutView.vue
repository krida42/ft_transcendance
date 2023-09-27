<template>
  <div class="about">
    <PongButton :angle="90"></PongButton>
    <h1 class="underline font-bold bg-blue-grey">This is</h1>
    <h1 class="underline font-bold cuicui">This is second</h1>
    <Icon class="rounded-full bg-black" size="50">
      <User />
    </Icon>
    <!-- <ChatMsgList /> -->
    <!-- <ChatBtnList> -->
    <!-- <ChatBtn start status="online">hey</ChatBtn>
      <ChatBtn status="offline">hey</ChatBtn>
      <ChatBtn status="online">heddy</ChatBtn>
      <ChatBtn end>hey</ChatBtn> -->
    <!-- <ChatBtn start status="online">hey</ChatBtn> -->
    <!-- <ChatBtn end status="online">Coucou toi comment ca va</ChatBtn> -->
    <!-- </ChatBtnList> -->
    <!-- <MyIcon>
      <Apple />
    </MyIcon> -->

    <ChatMsgList :messages="currentChatMsgsArray" title="Marine" />
  </div>
</template>

<style lang="scss" scoped>
.cuicui {
  background-color: pink;
}
</style>

<script lang="ts" setup>
import { watch } from "vue";
import { Icon } from "@vicons/utils";
import { User } from "@vicons/tabler";
import ChatMsgList from "@/components/Chat/ChatMsgList.vue";
import ChatMsgItem from "@/components/Chat/ChatMsgItem.vue";

import { useUsersStore } from "@/stores/users";

// import MyIcon from "@/components/MyIcon.vue";

import { useChatStore } from "@/stores/chat";
import { storeToRefs } from "pinia";

const chatStore = useChatStore();

let { openedChatId } = storeToRefs(chatStore);
let { currentChatMsgsArray } = storeToRefs(chatStore);

const usersStore = useUsersStore();

usersStore.refreshUser("marine");
usersStore.refreshUser("kevin");
usersStore.refreshUser("vincent");

watch(currentChatMsgsArray, (newVal) => {
  console.log("currentchatmshsubs", newVal);
});
</script>
