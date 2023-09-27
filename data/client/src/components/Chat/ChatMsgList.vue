<template>
  <div class="chat bg-blue-grey bg-opacity-80" ref="draggableContainer">
    <div class="header bg-blue-light" @mousedown="dragMouseDown">
      <span class="title">{{ title }}</span>
      <Icon size="20" class="dbd-red">
        <X class="bdd-cyan" />
      </Icon>
    </div>
    <div class="main">
      <ChatMsgItem
        v-for="msg in currentChatSortedBeautified"
        :key="msg.msgId"
        :content="msg.content"
        :pseudo="msg.userPseudo"
        :avatar="msg.userAvatar"
        :date="msg.createdAt"
        :is-me="msg.userId === usersStore.currentUser?.id"
      />
      <!-- <slot> </slot> -->
      <!-- <ChatMsgItem content="Salut je suis un message" />

      <ChatMsgItem
        content="Salut je suis un message"
        pseudo="Adrien"
        :date="new Date()"
        avatar="https://cdn.intra.42.fr/users/95f9dafeb1e78d2374207ab32c186d31/kisikaya.jpg"
      />
      <ChatMsgItem
        isMe
        content="je sais surtut celui de Mathieu"
        :date="new Date()"
        pseudo="Timothee"
      /> -->
    </div>
    <div class="footer">
      <input
        class="bg-gray-100"
        placeholder="Send a message..."
        type="text"
        v-model="inputMessage"
        @keyup.enter="sendMessage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  position: absolute;
  z-index: 9;

  display: grid;
  grid-template-rows: 9% 82% 9%;

  // $height: 30rem;
  $height: 35rem;
  // $width: 0.69 * $height;
  $width: 0.75 * $height;
  height: $height;
  width: $width;
  overflow: hidden;
  // background-color: #ff0000;
  // border: 2px red solid;
  border-radius: 12px;
  margin: auto;
  margin-bottom: 50px;
  // opacity: 0.8;
  // background-color: rgba(0, 0, 0, 1);
  // backdrop-filter: opacity(25);
  box-shadow: 0px 0px 10px 8px rgba(255, 0, 0, 0.514);
  // box-shadow: 4px 4px 9px 4px rgba(0, 0, 0, 0.3);
  font-size: 0.9em;
}
.header {
  cursor: move;
  z-index: 10;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 0.6rem;

  .title {
    font-family: "Baumans", cursive;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // border: 1px solid red;
    text-align: start;
  }
}

.main {
  display: flex;
  flex-direction: column;
  padding-inline: 0.5rem;
  padding-block: 0.5rem;
}

.footer {
  // background: #7c2c2c;
  input {
    width: 95%;
    border-radius: 12px;
    padding-block: 0.3rem;
    // padding-left: 0.4rem;
    padding-inline: 1.2rem;
  }
}
</style>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { X } from "@vicons/tabler";
import { ref, defineProps, computed } from "vue";
import { storeToRefs } from "pinia";
import ChatMsgItem from "./ChatMsgItem.vue";

let props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

import { useUsersStore } from "@/stores/users";
import { useChatStore } from "@/stores/chat";

const usersStore = useUsersStore();
const chatStore = useChatStore();

let { currentChatMsgsArray } = storeToRefs(chatStore);

const currentChatSorted = computed(() => {
  return [...currentChatMsgsArray.value].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
});

const currentChatSortedBeautified = computed(() => {
  let i = -1;
  let beautyfiedArr = [];
  while (++i < currentChatSorted.value.length) {
    let msg = currentChatSorted.value[i];
    let nextMsg = currentChatSorted.value[i + 1];

    if (nextMsg && msg.userId === nextMsg.userId) {
      beautyfiedArr.push({
        ...msg,
        userAvatar: undefined,
        userPseudo: undefined,
        createdAt: undefined,
      });
    } else {
      beautyfiedArr.push({
        ...msg,
      });
    }
  }
  console.log("beautyfiedArr", beautyfiedArr);
  return beautyfiedArr;
});

let positions = {
  clientX: 0,
  clientY: 0,
  movementX: 0,
  movementY: 0,
};

let draggableContainer = ref<HTMLDivElement>();

function dragMouseDown(event: MouseEvent) {
  event.preventDefault();
  // get the mouse cursor position at startup:
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;
}
function elementDrag(event: MouseEvent) {
  event.preventDefault();
  positions.movementY = positions.clientY - event.clientY;
  positions.movementX = positions.clientX - event.clientX;
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;

  if (!draggableContainer.value) return;
  // set the element's new position:
  draggableContainer.value.style.top =
    draggableContainer.value.offsetTop - positions.movementY + "px";
  draggableContainer.value.style.left =
    draggableContainer.value.offsetLeft - positions.movementX + "px";
}
function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
}

let inputMessage = ref("");

enum ChatType {
  Direct = "direct",
  Channel = "channel",
}

function sendMessage() {
  console.log(inputMessage.value, "hey");
  if (inputMessage.value === "r") {
    console.log("refreshing");
    chatStore.refreshChat("1", ChatType.Direct);
  }
  inputMessage.value = "";
}
</script>
