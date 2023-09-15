<template>
  <div class="about">
    <PongButton :angle="90"></PongButton>
    <h1 class="underline font-bold bg-blue-grey">This is</h1>
    <h1 class="underline font-bold cuicui">This is second</h1>
    <MyIcon>
      <User />
    </MyIcon>
    <MyIcon>
      <Apple />
    </MyIcon>
  </div>
</template>

<style lang="scss" scoped>
.cuicui {
  background-color: pink;
}
</style>

<script lang="ts" setup>
import { User, Apple } from "@vicons/tabler";
import MyIcon from "@/components/MyIcon.vue";
import PongButton from "@/components/PongButton.vue";
</script>
