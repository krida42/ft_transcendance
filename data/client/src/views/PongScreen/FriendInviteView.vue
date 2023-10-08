<template>
  <div class="pong-screen flex flex-col justify-center gap-[15%] px-[5rem]">
    <p class="leading-tight">
      Oops you don't have any<br />
      friends yet
    </p>
    <button
      class="pong-screen-button mx-auto"
      @click="() => $router.push('/main/friend-add')"
    >
      Add friend
    </button>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
