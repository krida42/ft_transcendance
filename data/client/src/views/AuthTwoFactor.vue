<template>
  <div class="auth-two-factor flex justify-center gap-[4rem]">
    <button @click="postActivate2FA">Activate 2FA</button>
    <button @click="postDeactivate2FA">Deactivate 2FA</button>
    <button @click="postAskForQRCode">Ask for QR code</button>
  </div>
</template>

<style lang="scss" scoped>
.auth-two-factor > * {
  background-color: $green-medium;
}
</style>

<script lang="ts" setup>
import axios from "axios";

const host = "localhost:3001/auth";

async function postActivate2FA() {
  const res = await axios.post(`${host}/2fa/turn-on`);
  console.log(res);
}

async function postDeactivate2FA() {
  const res = await axios.post(`${host}/2fa/turn-off`);
  console.log(res);
}

async function postAskForQRCode() {
  const res = await axios.post(`${host}/2fa/authenticate`);
  console.log(res);
}
</script>
