<script setup>
import PongGame from "@/components/Pong/PongGame";
import { onBeforeRouteLeave } from "vue-router";

onBeforeRouteLeave((to, from) => {
  if (to.name === "joinQueue") {
    window.location.href = "http://localhost:8080/main/join-queue";
  }
});
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
