<script setup>
import PongGame from "@/components/Pong/PongGame";
import { onBeforeRouteLeave } from "vue-router";
import { ref, onBeforeMount } from "vue";
import router from "@/router";

onBeforeRouteLeave((to, from) => {
  if (to.name === "joinQueue") {
    window.location.href = "http://localhost:8080/main/join-queue";
  }
  if (!isMobile() && from.name === "pong") {
    window.location.href = "http://localhost:8080/main/home";
  }
});

const isMobile = () => {
  const ua = navigator.userAgent;
  return /Android|Mobi/i.test(ua);
};

onBeforeMount(() => {
  if (isMobile()) {
    router.push("/main/nogame");
    //window.location.href = "http://localhost:8080/main/home";
  }
});
</script>

<template>
  <div
    class="min-w-[840px] min-h-[600px] w-[100vw] h-[100vh] relative flex justify-center items-center"
  >
    <PongGame />
  </div>
</template>

<style lang="scss"></style>
