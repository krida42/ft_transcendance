<template>
  <div class="chat bg-blue-grey bg-opacity-80" ref="draggableContainer">
    <Transition name="slide-in-left">
      <ChatUserActionPopup
        class="absolute top-[30%] left-0 right-0 mx-auto z-20"
        :uuid="chatUserActionPopup.userId"
        @close="closeChatUserActionPopup()"
        v-if="chatUserActionPopup.userId"
        :test="usersStore.users.get(chatUserActionPopup.userId)"
        admin
      />
    </Transition>
    <div class="header bg-blue-light" @mousedown="dragMouseDown">
      <span class="title">{{ currentChat?.name }}</span>
      <Icon
        size="20"
        class="close-icon dbd-red"
        @click="chatStore.openChat('')"
      >
        <X class="bdd-cyan" />
      </Icon>
    </div>

    <div
      class="main"
      :class="{
        'scroll-smooth': smootherScroll,
      }"
      ref="main"
      @scroll="handleScroll"
    >
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
          @mounted="scrollToBottom()"
          @click-avatar="openChatUserActionPopup(msg.userId)"
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
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb {
  // background-color: darkgray;
  background-color: $blue-light;
  border-radius: 9999px;
  // outline: 1px solid slategrey;
}

.chat {
  position: absolute;
  z-index: 9;

  display: grid;
  grid-template-rows: 9% 82% 9%;

  $height: 30rem;
  // $height: 35rem;
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

  .close-icon {
    cursor: pointer;
  }

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
  overflow-y: auto;
  overflow-x: hidden;
  // scroll-behavior: smooth;

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

@keyframes my-bounce {
  0%,
  100% {
    // transform: translateY(-25%);
    transform: none;
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    // transform: none;
    transform: translateY(50%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-my-bounce {
  animation: my-bounce 2s;
}

@keyframes slide-in-left {
  0% {
    transform: translateX(-50%);
    opacity: 0;
  }
  100% {
    transform: translateZ(0) translateX(0);
    opacity: 1;
  }
}

.slide-in-left-enter-active {
  animation: slide-in-left 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.slide-in-left-leave-active {
  animation: slide-in-left 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse
    both;
}
</style>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { X } from "@vicons/tabler";
import { ref, computed, nextTick, onMounted, watch, reactive } from "vue";
import { storeToRefs } from "pinia";
import ChatMsgItem from "./ChatMsgItem.vue";

// let props = defineProps({});

import { useUsersStore } from "@/stores/users";
import { useChatStore } from "@/stores/chat";
import { MessageTransformer } from "@/utils/messageTransformer";
import ChatUserActionPopup from "./ChatUserActionPopup.vue";

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

let cooldown = ref(false);

async function sendMessage() {
  console.log(inputMessage.value);
  if (!chatStore.currentChat) throw new Error("no current chat");
  if (!inputMessage.value) return;
  if (cooldown.value === true) {
    return;
  }
  if (inputMessage.value.length > 150) {
    inputMessage.value = "Abuse pas, 150 caractères max !";
    return;
  }
  chatStore
    .sendMessage(
      chatStore.openedChatId,
      chatStore.currentChat!.chatType,
      inputMessage.value
    )
    .then(() => {
      scrollToBottom();
      cooldown.value = true;
      setTimeout(() => {
        cooldown.value = false;
      }, 500);
    });

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

let smootherScroll = ref(true);
/*eslint-disableee */
function handleScroll(event: Event) {
  // void event;
  // // console.log("coiucou");
  // if (!main.value) return;
  // if (main.value.scrollTop === 0) {
  //   console.log("scrolling to top");
  //   const previousHeight = main.value.scrollHeight;
  //   chatStore.loadMoreMessages().then(() => {
  //     smootherScroll.value = false;
  //     nextTick(() => {
  //       requestAnimationFrame(() => {
  //         setTimeout(() => {
  //           if (!main.value) return;
  //           const currentHeight = main.value.scrollHeight;
  //           const heightDifference = currentHeight - previousHeight;
  //           main.value.scrollTop += heightDifference;
  //           smootherScroll.value = true;
  //         }, 50);
  //       });
  //     });
  //   });
  // }
}
/*eslint-enableeee */
// let isChatUserActionPopedUp = ref(false);

let chatUserActionPopup = reactive({
  userId: "",
  isAdmin: false,
});

function openChatUserActionPopup(userId: string) {
  if (userId !== usersStore.currentUser?.id)
    chatUserActionPopup.userId = userId;
}

function closeChatUserActionPopup() {
  chatUserActionPopup.userId = "";
}

// setTimeout(() => {
//   scrollToBottom();
// }, 2000);
</script>
