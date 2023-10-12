<template>
  <div class="form-wrapper flex justify-center mx-auto">
    <form @submit.prevent="sendForm">
      <input
        v-model="username"
        placeholder="username..."
        type="text"
        minlength="3"
        maxlength="15"
        class="bg-black text-[1.5rem] border-2 border-[#828287] ml-[3rem] mr-[1rem] pl-[0.5rem]"
      />
    </form>
    <img
      class="w-[2rem]"
      :class="isSent ? 'w-[2rem]' : 'w-[2.5rem]'"
      :src="
        isSent
          ? isValidUsername
            ? require('@/assets/svg/green-tick.svg')
            : require('@/assets/svg/red-cross.svg')
          : require('@/assets/svg/search-icon.svg')
      "
    />
  </div>
  <p
    :class="[
      isValidUsername ? 'text-green-my' : 'text-red-my',
      $props.mode === 'addFriend' ? 'block' : 'hidden',
    ]"
    class="h-[0.5rem]"
  >
    {{ loginMessage }}
  </p>
</template>

<script lang="ts" setup>
import { useFriendStore } from "@/stores/friend";
import { ref } from "vue";
import { defineProps } from "vue";
const username = ref("");
const loginMessage = ref("");
const isSent = ref(false);
const isValidUsername = ref(false);
const friendStore = useFriendStore();

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
});

const sendFriendRequest = () => {
  isSent.value = true;
  if (username.value === "mvue") {
    loginMessage.value = "request sent to " + username.value;
    isValidUsername.value = true;
  } else {
    loginMessage.value = "user " + username.value + " not found";
    isValidUsername.value = false;
  }
  username.value = "";
};

const sendGameRequest = () => {
  isSent.value = true;
  if (username.value === "vbarbier") {
    loginMessage.value = "request sent to " + username.value;
    isValidUsername.value = true;
  } else {
    loginMessage.value = "user " + username.value + " not found";
    isValidUsername.value = false;
  }
  username.value = "";
};

const sendForm =
  props.mode === "addFriend" ? sendFriendRequest : sendGameRequest;
</script>
