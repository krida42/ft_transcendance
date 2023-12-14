<template>
  <div class="2FAEnable w-[100%] h-[100%] flex flex-col justify-evenly">
    <div class="text-ctn flex flex-col gap-[1.5rem]">
      <p class="leading-none">
        Do you want to enable 2<br />
        factor authentification?
      </p>
      <p class="text-[1.5rem] leading-none">
        (You can change your mind <br />
        later in the settings)
      </p>
    </div>
    <div class="buttons-ctn flex justify-evenly">
      <button @click="postActivate2FA" class="pong-screen-button w-[6rem]">
        Yes
      </button>
      <button @click="postDeactivate2FA" class="pong-screen-button w-[6rem]">
        No
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";

const host = `${process.env.VUE_APP_CUICUI}:3001/auth`;

async function postActivate2FA() {
  const response = await fetch(`${host}/2fa/turn-on`, {
    method: "POST",
    credentials: "include",
  });
  const route = await router.push("/auth/2FA-QR");
  Promise.all([response, route]);
}

async function postDeactivate2FA() {
  const response = await fetch(`${host}/2fa/turn-off`, {
    method: "POST",
    credentials: "include",
  });
  const route = await router.push("/main/home");
  Promise.all([response, route]);
}
</script>
