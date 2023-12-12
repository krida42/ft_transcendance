<template>
  <div class="grey-overlay absolute top-0 left-0 w-[100%] h-[100%] z-10">
    <div
      class="error-popup absolute top-[25%] left-[27%] w-[40%] h-[40%] bg-green-bg opacity-90 z-100 flex flex-col justify-center items-center gap-[15%] rounded-[15px]"
    >
      <img
        @click="$emit('close')"
        class="cross cursor-pointer absolute top-5 right-5 w-[30px]"
        src="@/assets/svg/cross_close.svg"
        alt="close"
      />
      <h1 class="text-[2rem] absolute top-1 left-5">{{ statusCode }}</h1>
      <p class="text-[1.3rem]">{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps({
  statusCode: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.grey-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.error-popup {
  border-radius: 15px;
}
</style>
