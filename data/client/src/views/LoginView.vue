<template>
  <div class="login text-white uppercase">
    <h1 class="pb-[1rem]">Pong</h1>
    <div
      class="pong-screen w-[38rem] h-[26rem] m-auto rounded-[53px] bg-black flex items-center flex-col justify-center"
    >
      <p class="leading-none">
        Please sign in with <br />
        42 to continue
      </p>
      <button
        ref="auth_button"
        class="py-0 px-[1rem] border-2 border-white uppercase"
      >
        Sign in
      </button>
      <img class="w-[4rem]" src="../assets/svg/42_logo.svg" />
    </div>
  </div>
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

// console.log("env var: ", import.meta.env.VITE_API_URL")
console.log("env var: ", process.env);

const auth_button = ref<HTMLElement | null>(null);
useEventListener(auth_button, "click", () => {
  console.log("click");
  axios.defaults.withCredentials = true;
  // axios
  //   .get("http://localhost:3001/auth/42")
  //   .then((res) => {
  //     window.location.href = res.data;
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log("my error: ", err.message);
  //   });
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

<style lang="scss" scoped>
.login {
  font-size: 1.8rem;
  font-family: "VT323", monospace;
}

.pong-screen {
  gap: 2.5rem;
}

button:hover {
  background-color: white;
  color: black;
}

@media (max-width: 42rem) {
  .pong-screen {
    width: 90vw;
    height: 70vw;
  }
  .pong-screen {
    gap: 6vw;
  }
}
</style>

<!-- font-family: 'Baumans', cursive;

font-family: 'Roboto', sans-serif;

font-family: 'VT323', monospace; -->
