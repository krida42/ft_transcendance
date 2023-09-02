<template>
  <div class="about">
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
</script>
