<template>
  <p class="leading-none">
    Please sign in with <br />
    42 to continue
  </p>
  <button ref="auth_button" class="pong-screen-button">Sign in</button>
  <img class="w-[4rem]" src="@/assets/svg/42_logo.svg" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useEventListener } from "@vueuse/core";
import axios from "axios";

async function getAuthorizationUrl(): Promise<string> {
  const clientId = "?client_id=" + process.env.VUE_APP_FORTY_TWO_UID;
  const redirectUri =
    "&redirect_uri=" + encodeURIComponent(process.env.VUE_APP_CALLBACK_URL);
  const responseType = "&response_type=code";
  const scope = "&scope=public";
  const state = "&state=some-random-string-of-your-choice";

  const authorizationURL = `${process.env.VUE_APP_FORTY_TWO_AUTH_URL}${clientId}${redirectUri}${responseType}${scope}${state}`;
  return authorizationURL;
}

const auth_button = ref<HTMLElement | null>(null);
useEventListener(auth_button, "click", () => {
  axios.defaults.withCredentials = true;
  getAuthorizationUrl()
    .then((res) => {
      window.location.href = res;
      console.log(res);
    })
    .catch((err) => {
      console.log("my error: ", err.message);
    });
});
</script>
