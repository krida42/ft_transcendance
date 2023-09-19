<template>
  <button
    class="button-menu w-[3.5rem] h-[3.5rem] z-10 bg-green-light rounded-full absolute drop-shadow-md"
  >
    <img
      class="m-auto w-[2rem]"
      :src="require(`@/assets/svg/${svgName}`)"
      alt="menu_button"
    />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps({ svgName: String });
</script>

<style lang="scss" scoped>
.button-menu:hover {
  background-color: $yellow-hover;
}

@media (max-width: 640px) {
  .button-menu {
    background-color: $green-medium;
  }
}
</style>
