<template>
  <!-- <qrcode-vue
    :value="otpAuthUrl"
    :level="level"
    :render-as="renderAs"
    class="w-[300px]"
  /> -->
  <img :src="qrCodeURL" alt="" class="w-[300px]" />
  <div class="auth-two-factor flex justify-center gap-[2rem]">
    <button @click="postActivate2FA">Activate 2FA</button>
    <button @click="postDeactivate2FA">Deactivate 2FA</button>
    <button @click="setupQRCode">Setup 2FA</button>
  </div>
  <form @submit.prevent="postAskForQRCode">
    <input
      v-model="input"
      placeholder="username..."
      type="text"
      minlength="3"
      maxlength="15"
      class="bg-black text-[1.5rem] border-2 border-[#828287] ml-[3rem] mr-[1rem] pl-[0.5rem]"
    />
  </form>
  <!-- Utilisation du composant qrcode.vue pour afficher le code QR -->
  <!-- <qrcode-vue :value="qrCodeURL" class="w-[300px]" /> -->
</template>

<script lang="ts" setup>
import { ref } from "vue";

const host = "http://localhost:3001/auth";
const qrCodeURL = ref("");
const otpAuthUrl = ref("");
const input = ref("");

async function setupQRCode() {
  const response = await fetch(`${host}/2fa/setup`, {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const data = await response.json();
    qrCodeURL.value = data.qrCodeDataURL;
    otpAuthUrl.value = data.otpAuthUrl;
  } else {
    // Gérer les erreurs si nécessaire
  }
}

async function postActivate2FA() {
  const response = await fetch(`${host}/2fa/turn-on`, {
    method: "POST",
    credentials: "include",
  });
}

async function postDeactivate2FA() {
  const response = await fetch(`${host}/2fa/turn-off`, {
    method: "POST",
    credentials: "include",
  });
}

async function postAskForQRCode() {
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
  console.log(response);
}
</script>

<style lang="scss" scoped>
.auth-two-factor > * {
  background-color: $green-medium;
}
</style>
