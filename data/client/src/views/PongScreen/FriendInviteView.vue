<template>
  <div class="pong-screen flex flex-col justify-center gap-[15%] px-[5rem]">
    <p class="leading-tight">
      Choose a friend<br />
      to invite
    </p>

    <div class="friend-caroussel"></div>
    <div class="friend-search"></div>
  </div>
</template>

<script lang="ts" setup>
import { useFriendStore } from "@/stores/friend";
import { storeToRefs } from "pinia";

const friendStore = useFriendStore();
await friendStore.refreshFriendList();

console.log(friendStore.friends);
</script>

<style lang="scss" scoped></style>
