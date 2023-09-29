<template>
  <div
    class="button-wrapper flex flex-col gap-[0.5rem] cursor-pointer"
    :style="cssProps"
  >
    <p class="title text-black text-xl uppercase w-[10rem]"><slot></slot></p>
    <button
      class="pong-button bg-blue-button w-[3.5rem] h-[3.5rem] rounded-[10rem] self-center drop-shadow-lg"
      @click="$emit('click')"
    >
      <div
        class="button-top-indicator w-[0.2rem] h-[1rem] bg-white mx-auto mb-[1.5rem]"
      ></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
const props = defineProps({ angle: Number });
const cssProps = computed(() => {
  return { "--angle": props.angle + "deg" };
});
</script>

<style lang="scss" scoped>
.title {
  font-family: "Baumans", cursive;
}

.pong-button {
  transition: all 0.3s ease-in;
}
.pong-button:hover {
  background-color: $yellow-hover;
  transform: rotate(var(--angle));
}

@media (max-width: 640px) {
  .title {
    width: 8rem;
    font-size: 1rem;
  }
}
</style>
