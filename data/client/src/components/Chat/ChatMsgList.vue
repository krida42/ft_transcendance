<template>
  <div class="chat bg-blue-grey bg-opacity-80" ref="draggableContainer">
    <div class="header bg-blue-light" @mousedown="dragMouseDown">
      <span class="title">{{ currentChat?.name }}</span>
      <Icon size="20" class="dbd-red">
        <X class="bdd-cyan" />
      </Icon>
    </div>
    <div class="main" ref="main" @scroll="handleScroll">
      <transition-group name="msg-item-animation" v-if="true">
        <ChatMsgItem
          v-for="msg in currentChatTreated"
          :key="msg.vueTrackId || msg.msgId"
          :content="msg.content"
          :pseudo="msg.userPseudo"
          :avatar="msg.userAvatar"
          :date="msg.createdAt"
          :is-me="msg.userId === usersStore.currentUser?.id"
          :ack="msg.ack"
          :solo="msg.solo"
        />
      </transition-group>

      <!-- <transition-groupe name="msg2-item" v-else>
        <div
          class="mg-item-ctn bd-blue"
          v-for="msg in currentChatTreated"
          :key="msg.vueTrackId || msg.msgId"
        >
          <ChatMsgItem
            :content="msg.content"
            :pseudo="msg.userPseudo"
            :avatar="msg.userAvatar"
            :date="msg.createdAt"
            :is-me="msg.userId === usersStore.currentUser?.id"
            :ack="msg.ack"
            :class="{
              'ml-auto': msg.userId === usersStore.currentUser?.id,
            }"
          />
        </div>
      </transition-groupe> -->
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
  // box-shadow: 10px 10px 5px 5px rgba(5, 0, 0, 254);
  // box-shadow: 0px 0px 10px 9px rgba(0, 0, 0, 0.3);
  // box-shadow: 0 0 0 2px rgba(218, 102, 123, 1),
  //     8px 8px 0 0 rgba(218, 102, 123, 1);
  // box-shadow: 0px 9px 30px rgba(255, 149, 5, 0.3);
  // box-shadow: -10px 10px 0px rgba(33, 33, 33, 1),
  //   -20px 20px 0px rgba(33, 33, 33, 0.7), -30px 30px 0px rgba(33, 33, 33, 0.4),
  //   -40px 40px 0px rgba(33, 33, 33, 0.1);
  // box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.35);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
    0 16px 16px rgba(0, 0, 0, 0.12);
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
  // padding-block: 0.2rem;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;

  .msg-item-enter-active {
    transition: all 0.3s;
  }
  .msg-item-leave-active {
    transition: all 0.3s;
  }
  .msg-item-enter-from {
    opacity: 0;
    transform: translateY(100%);
  }
  .msg-item-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }

  .msg-item-animation-enter-active {
    animation: shade-in-move 0.3s;
  }

  @keyframes shade-in-move {
    0% {
      transform: translateY(50%);
    }

    100% {
      transform: translateY(0%);
    }
  }
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
import { Message, X } from "@vicons/tabler";
import { ref, defineProps, computed } from "vue";
import { storeToRefs } from "pinia";
import ChatMsgItem from "./ChatMsgItem.vue";

// let props = defineProps({});

import { useUsersStore } from "@/stores/users";
import { useChatStore } from "@/stores/chat";
import { MessageTransformer } from "@/utils/messageTransformer";

const usersStore = useUsersStore();
const chatStore = useChatStore();

let { currentChat } = storeToRefs(chatStore);

const currentChatTreated = computed(() => {
  return MessageTransformer.treatMessages(
    currentChat.value?.messages,
    usersStore.users
  );
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

async function sendMessage() {
  console.log(inputMessage.value, "hey");
  if (inputMessage.value === "/r") {
    console.log("refreshing");
    chatStore.refreshChat("marine", ChatType.Direct, null);
  } else if (inputMessage.value === "/ra4") {
    console.log("refreshing");
    chatStore.refreshChat("marine", ChatType.Direct, "a4");
  } else if (inputMessage.value === "/s") {
    console.log("refreshing randome");
    chatStore.refreshChat("someone", ChatType.Direct, null);
  } else {
    chatStore
      .sendMessage(chatStore.openedChatId, ChatType.Direct, inputMessage.value)
      .then(() => {
        scrollToBottom();
      });
  }
  inputMessage.value = "";
}

let main = ref<HTMLDivElement>();

function scrollToBottom() {
  if (!main.value) return;
  main.value.scrollTop = main.value.scrollHeight;
  // requestAnimationFrame(() => {
  //   main.value!.scrollTop = main.value!.scrollHeight;
  // });
}

function handleScroll(event: Event) {
  if (!main.value) return;
  if (main.value.scrollTop === 0) {
    console.log("scrolling to top");

    // const previousHeight = main.value.scrollHeight;
    // const previousScrollTop = main.value.scrollTop;

    chatStore.loadMoreMessages();

    // const heightDifference = main.value.scrollHeight - previousHeight;
    // main.value.scrollTop = previousScrollTop + heightDifference;
  }
}
</script>
