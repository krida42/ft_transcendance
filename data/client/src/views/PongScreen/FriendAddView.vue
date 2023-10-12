<template>
  <div class="pong-screen flex flex-col justify-center p-[1rem] gap-[2.5rem]">
    <p class="leading-tight">
      Type someone's username <br />
      to send them a friend request
    </p>
    <SearchUser mode="addFriend" />
  </div>
</template>

<script lang="ts" setup>
import SearchUser from "@/components/SearchUser.vue";
</script>
