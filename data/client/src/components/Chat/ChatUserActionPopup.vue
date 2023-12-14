<template>
  <div
    class="chat-user-action-popup-admin w-[18rem] bg-black bg-opacity-80 rounded-xl text-white px-5 py-5"
  >
    <div class="user-info dbg-green-200 grid grid-cols-12 gap-x-3 items-center">
      <div class="user-avatar col-span-3 border-red-900 border-2d">
        <img
          :src="user?.avatar"
          alt="avatar"
          class="rounded-full w-[92%] mx-auto cursor-pointer"
          @click="() => router.push(`/profile/${user?.id}`)"
        />
      </div>
      <p
        class="user-name dbd-blue truncate col-span-8 self-center px-3 text-start cursor-pointer"
        @click="() => router.push(`/profile/${user?.id}`)"
      >
        {{ user?.pseudo }}
      </p>
      <Icon
        size="1.8rem"
        class="bd-blues self-start justify-self-end relative right-[-0.7rem] top-[-0.8rem] cursor-pointer"
        @click="
          {
            emits('close');
            isErr = false;
          }
        "
      >
        <X />
      </Icon>
    </div>
    <div class="actions flex dbg-blue-200 items-center mt-4 gap-x-5 bd-redd">
      <!-- <button class="hover:bg-gray-500">ADD FRIEND</button> -->
      <button
        v-if="user"
        class="border-[1px]"
        :class="{
          'hover:bg-gray-500': canAddFriend,
          'border-white': canAddFriend,
          'text-gray-400': !canAddFriend,
          'border-gray-400': !canAddFriend,
        }"
        @click="canAddFriend ? sendFriendRequest(user!.id) : null"
        :disabled="!canAddFriend"
      >
        {{
          canAddFriend
            ? "ADD FRIEND"
            : friendStore.friendsSent.has(user.id)
            ? "SENT ✓"
            : "FRIEND ✓"
        }}
      </button>
      <button
        class="border-[1px] border-white text-gray-400 hover:bg-gray-500 hover:text-gray-200"
        @click="invitePlay(user?.id)"
      >
        Play
      </button>
      <button
        v-if="chatType === ChatType.Direct && !admin && user"
        class="border-[1px] border-white text-red-my hover:bg-[#7c2c2c]"
        @click="
          friendStore.blocked.has(user.id)
            ? unblockUser(user!.id)
            : blockUser(user!.id)
        "
      >
        {{ !user || friendStore.blocked.has(user.id) ? "UNBLOCK" : "BLOCK" }}
      </button>

      <!-- <button class="w-[100%] hover:bg-gray-500">ADD FRIEND</button> -->
    </div>
    <div
      class="admin-btns gap-x-5 gap-y-3 grid grid-cols-3 mt-4"
      v-if="chatType === ChatType.Channel && admin"
    >
      <button class="px-4" @click="kickUser">KICK</button>
      <button class="px-4 mr" @click="banUser">BAN</button>
      <button class="" @click="muteUser">MUTE 10M</button>
    </div>
    <p v-if="isErr" class="mt-[1rem]">{{ error.message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { X } from "@vicons/tabler";
import { computed, defineEmits, defineProps, ref } from "vue";
import { useFriendStore } from "@/stores/friend";
import { useUsersStore } from "@/stores/users";
import { useChannelsStore } from "@/stores/channels";
import { useChatStore } from "@/stores/chat";
import router from "@/router";
import { User } from "@/types";
import channelsApi from "@/api/channel";
import { ChatType } from "@/types";
import { setOptions } from "@/game/game";
import { ErrorPop } from "@/types";
import axios, { AxiosError } from "axios";

const props = defineProps({
  test: {
    type: Object as () => User,
    required: false,
  },
  uuid: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emits = defineEmits(["close"]);

const usersStore = useUsersStore();
const friendStore = useFriendStore();
const { sendFriendRequest, blockUser, unblockUser } = friendStore;
const channelsStore = useChannelsStore();
const chatStore = useChatStore();
const chatType = ref(chatStore?.currentChat?.chatType);
const isErr = ref(false);
const error = ref<ErrorPop>({
  statusCode: 0,
  message: "",
});

const user = computed(() => {
  return usersStore.users.get(props.uuid);
});

let canAddFriend = computed(() => {
  if (!user.value) return false;
  return (
    !friendStore.friends.has(user.value.id) &&
    !friendStore.friendsSent.has(user.value.id)
  );
});

const kickUser = () => {
  if (chatStore.currentChat) {
    channelsStore
      .kickUser(chatStore.currentChat.id, props.uuid)
      .then(() => emits("close"))
      .catch((err: AxiosError | Error) => {
        isErr.value = true;
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.message) {
            if (Array.isArray(err.response.data.message))
              error.value.message = err.response.data.message[0];
            else error.value.message = err.response.data.message;
          }
          if (err.response && err.response.status)
            error.value.statusCode = err.response.status;
        } else {
          error.value.message = err.message;
        }
      });
  }
};

const banUser = () => {
  if (chatStore.currentChat) {
    channelsStore
      .banUser(chatStore.currentChat.id, props.uuid)
      .then(() => emits("close"))
      .catch((err: AxiosError | Error) => {
        isErr.value = true;
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.message) {
            if (Array.isArray(err.response.data.message))
              error.value.message = err.response.data.message[0];
            else error.value.message = err.response.data.message;
          }
          if (err.response && err.response.status)
            error.value.statusCode = err.response.status;
        } else {
          error.value.message = err.message;
        }
      });
  }
};

const muteUser = () => {
  if (chatStore.currentChat) {
    channelsApi
      .muteUser(chatStore.currentChat.id, props.uuid)
      .then(() => emits("close"))
      .catch((err: AxiosError | Error) => {
        isErr.value = true;
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.message) {
            if (Array.isArray(err.response.data.message))
              error.value.message = err.response.data.message[0];
            else error.value.message = err.response.data.message;
          }
          if (err.response && err.response.status)
            error.value.statusCode = err.response.status;
        } else {
          error.value.message = err.message;
        }
      });
  }
};

const invitePlay = (userId: string | undefined) => {
  if (!userId) return;
  const options = {
    uuid: userId,
  };
  setOptions(options);
  router.push("/pong");
};
</script>

<style lang="scss" scoped>
.chat-user-action-popup-admin {
  font-family: "Baumans";
}

button {
  //   background: #7c2c2c;
  // border: 1px solid white;
  border-radius: 0.5rem;
  width: 100%;
  //   margin-top: 0.4rem;
  //   margin-bottom: 1rem;
  height: 2.3rem;

  &:active {
    transform: scale(0.95);
  }
}
div.admin-btns > * {
  color: $red-my;
  border: 1px solid white;
  //   padding-inline: 1px;
  &:hover {
    background-color: #7c2c2c;
  }
}
</style>
