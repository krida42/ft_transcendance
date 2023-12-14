<template>
  <div
    class="2FACode w-[100%] h-[100%] leading-none flex flex-col justify-evenly items-center"
  >
    <p>Please enter the code <br />from your authenticator app</p>
    <form @submit.prevent="postCompareCode" class="relative">
      <input
        v-model="input"
        placeholder="ex:123456"
        type="text"
        minlength="3"
        maxlength="15"
        class="bg-black text-[2rem] border-[#828287] text-center border-2 px-[1rem]"
      />
      <img
        class="w-[2rem] absolute right-[-3rem] top-[0.1rem]"
        :class="isSent ? 'visible' : 'visible'"
        :src="
          isValidCode
            ? require('@/assets/svg/green-tick.svg')
            : require('@/assets/svg/red-cross.svg')
        "
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
const input = ref("");
const host = `${process.env.VUE_APP_CUICUI}:3001/auth`;
const isValidCode = ref(false);
const isSent = ref(false);

async function postCompareCode() {
  isSent.value = true;
  try {
    const response = await fetch(`${host}/2fa/authenticate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        twoFactorAuthCode: input.value,
      }),
    });
    if (response.ok) {
      await router.push("/main/home");
    } else {
      isValidCode.value = false;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
