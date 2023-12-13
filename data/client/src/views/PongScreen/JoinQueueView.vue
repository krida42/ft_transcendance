<template>
  <div class="pong-screen flex flex-col justify-center p-[1rem] gap-[2.5rem]">
    <p class="leading-tight">
      You are about to <br />
      join a queue. <br />
      Continue?
    </p>
    <div class="buttons-yes-no flex justify-evenly">
      <button @click="joinQueue">YES</button>
      <button @click="router.push('/main/home')">NO</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
// import { socket as socket } from "@/socket";

const joinQueue = () => {
  console.log("Joining queue");
  // socket.emit("randomRoom");
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
