<template>
  <div
    :class="$props.overlay ? 'grey-overlay' : ''"
    class="absolute top-0 left-0 w-[100%] h-[100%] z-10"
  >
    <div
      class="error-popup absolute top-[50%] left-[50%] ml-[-18%] mt-[-18%] w-[36%] h-[36%] bg-green-bg opacity-90 z-100 flex flex-col justify-center items-center gap-[15%] rounded-[15px] p-[1rem]"
    >
      <img
        @click="$emit('close')"
        class="cross cursor-pointer absolute top-5 right-5 w-[30px]"
        src="@/assets/svg/cross_close.svg"
        alt="close"
      />
      <h1 class="text-[2rem] absolute top-1 left-5">{{ statusCode }}</h1>
      <p class="text-[1.4rem]">{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onBeforeUnmount, defineEmits } from "vue";

defineProps({
  statusCode: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  overlay: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["close"]);

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      emit("close");
    }
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      emit("close");
    }
  });
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
