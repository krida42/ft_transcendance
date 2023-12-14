<template>
  <div
    class="achievement-item flex flex-col gap-[0.5rem] justify-top items-center pb-[1rem]"
  >
    <div class="w-[5rem] h-[5rem] rounded-full overflow-hidden">
      <img
        :src="props.img"
        alt="user image"
        class="w-[100%] h-[5rem] object-cover"
        :title="props.description"
      />
    </div>
    <p>{{ props.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
