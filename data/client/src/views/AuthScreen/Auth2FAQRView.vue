<template>
  <div
    class="2FAQR w-[100%] h-[100%] leading-none flex flex-col justify-center items-center gap-[1.8rem]"
  >
    <p>
      Please scan this qr Code with<br />
      your authentication app of <br />choice
    </p>
    <img :src="qrCodeURL" alt="" class="w-[170px] aspect-square" />
    <div
      class="w-[100%] flex justify-evenly text-[1.5rem] opacity-60 underline decoration-1"
    >
      <p @click="postDeactivate2FA" class="cursor-pointer">Later</p>
      <p @click="() => $router.push('/auth/2FA-code')" class="cursor-pointer">
        Next
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ref, onMounted } from "vue";

const host = `${process.env.VUE_APP_CUICUI}:3001/auth`;
const qrCodeURL = ref("");
const otpAuthUrl = ref("");

async function postDeactivate2FA() {
  const response = await fetch(`${host}/2fa/turn-off`, {
    method: "POST",
    credentials: "include",
  });
  const route = await router.push("/main/home");
  Promise.all([response, route]);
}

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

onMounted(setupQRCode);
</script>
