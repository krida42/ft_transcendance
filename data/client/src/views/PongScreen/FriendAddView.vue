<template>
  <div class="pong-screen flex flex-col justify-center p-[1rem]">
    <p class="leading-tight">
      Type someone's login to send them a friend request
    </p>
    <div class="form-wrapper flex justify-center my-[2.5rem] mx-auto">
      <form @submit.prevent="sendLoginInput">
        <input
          v-model="login"
          placeholder=" login..."
          type="text"
          minlength="3"
          maxlength="20"
          class="bg-black border-[0.2rem] border-[#828287] ml-[3rem] mr-[1rem]"
        />
      </form>
      <img
        class="w-[2rem]"
        :class="isSent ? 'visible' : 'invisible'"
        :src="
          isValidlLogin
            ? require('@/assets/svg/green-tick.svg')
            : require('@/assets/svg/red-cross.svg')
        "
      />
    </div>
    <p
      :class="isValidlLogin ? 'text-green-my' : 'text-red-my'"
      class="h-[0.5rem]"
    >
      {{ loginMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const login = ref("");
const loginMessage = ref("");
const isSent = ref(false);
const isValidlLogin = ref(false);
const sendLoginInput = () => {
  isSent.value = true;
  if (login.value === "mvue") {
    loginMessage.value = "request sent to " + login.value;
    isValidlLogin.value = true;
  } else {
    loginMessage.value = "user " + login.value + " not found";
    isValidlLogin.value = false;
  }
  login.value = "";
};
</script>

<style lang="scss" scoped></style>
