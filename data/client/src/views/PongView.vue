<script setup>
import PongGame from "@/components/Pong/PongGame";
// import { onBeforeRouteLeave } from "vue-router";
// import { socketGame as socket } from "@/socket";
// onBeforeRouteLeave((to, from) => {
//   if (to.name !== "PongView") {
//     socket.destroy();
//   }
// });
</script>

<template>
  <PongGame />
</template>

<style lang="scss">
body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>
