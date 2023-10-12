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

const host = "http://localhost:3001/auth";

async function postActivate2FA() {
  const response = await fetch(`${host}/2fa/turn-on`, {
    method: "POST",
    credentials: "include",
  });
  //   const res = await axios
  //     .post(`C`, { withCredentials: true })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //console.log(res);
}

async function postDeactivate2FA() {
  const response = await fetch(`${host}/2fa/turn-off`, {
    method: "POST",
    credentials: "include",
  });
  //console.log(res);
}

async function postAskForQRCode() {
  const response = await fetch(`${host}/2fa/authenticate`, {
    method: "POST",
    credentials: "include",
  });
  //console.log(res);
}
</script>
