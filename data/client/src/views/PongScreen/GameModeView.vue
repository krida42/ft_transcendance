<template>
  <div class="pong-screen flex flex-col justify-center p-[1rem] gap-[2.5rem]">
    <p class="leading-tight">Choose a game mode</p>
    <div class="buttons-yes-no flex justify-evenly">
      <button @click="joinQueue">Small Ball</button>
      <button @click="router.push('/main/home')">Big Ball</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
// import { socket as socket } from "@/socket";

const joinQueue = () => {
  router.push("/pong");
};
</script>

<style lang="scss" scoped>
button {
  border: 2px solid black;
  padding-inline: 4px;
}
button:hover {
  border-bottom: 2px solid white;
}
</style>
