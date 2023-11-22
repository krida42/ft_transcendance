<template>
  <div class="login text-white uppercase">
    <h1 class="pb-[1rem]">Pong</h1>
    <div
      class="auth-screen w-[38rem] h-[26rem] m-auto rounded-[53px] bg-black flex items-center flex-col justify-center gap-[2.5rem]"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router/index";
</script>

<style lang="scss" scoped>
.login {
  font-size: 1.8rem;
  font-family: "VT323", monospace;
}
@media (max-width: 42rem) {
  .auth-screen {
    width: 90vw;
    height: 70vw;
  }
  .auth-screen {
    gap: 6vw;
  }
}
</style>

<!-- font-family: 'Baumans', cursive;
  
  font-family: 'Roboto', sans-serif;
  
  font-family: 'VT323', monospace; -->
