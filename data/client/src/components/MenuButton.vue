<template>
  <div
    ref="gravity_button"
    class="grid place-items-center aspect-square rounded-[50%]"
    :style="{
      width: size,
    }"
  >
    <button
      class="button-menu w-[64px] aspect-square z-10 bg-green-light rounded-[50%] drop-shadow-md"
      v-bind="{
        style: {
          transform: `translate(${tx}px, ${ty}px)`,
        },
      }"
      @click="$emit('click-cuicui')"
    >
      <img
        class="m-auto w-[2rem]"
        :src="require(`@/assets/svg/${svgName}`)"
        alt="menu_button"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useEventListener, useWindowSize, debouncedWatch } from "@vueuse/core";
import { ref, onMounted } from "vue";

defineProps({
  svgName: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "150px",
  },
});

const { width, height } = useWindowSize();
const gravity_button = ref<HTMLElement | null>(null);
const buttonPos = ref<DOMRect | undefined>(undefined);
const tx = ref<number>(0);
const ty = ref<number>(0);

onMounted(() => {
  buttonPos.value = gravity_button?.value?.getBoundingClientRect();
});

debouncedWatch(
  [width, height],
  () => {
    buttonPos.value = gravity_button?.value?.getBoundingClientRect();
  },
  { debounce: 200 }
);

useEventListener(gravity_button, "mousemove", (e) => {
  if (buttonPos.value) {
    const h = buttonPos.value.width / 2;
    const x = e.clientX - buttonPos.value.left - h;
    const y = e.clientY - (buttonPos.value.top - window.scrollY) - h;
    const r1 = Math.sqrt(x * x + y * y);
    const r2 = (1 - r1 / h) * r1;
    const angle = Math.atan2(y, x);
    tx.value = Math.round(Math.cos(angle) * r2 * 100) / 100;
    ty.value = Math.round(Math.sin(angle) * r2 * 100) / 100;
  }
});

useEventListener(gravity_button, "mouseleave", () => {
  tx.value = 0;
  ty.value = 0;
});
</script>

<style lang="scss" scoped>
.menu-button {
  transition: all 0.3s ease-out;
}
.button-menu:hover {
  background-color: $yellow-hover;
}

@media (max-width: 640px) {
  .button-menu {
    background-color: $green-medium;
  }
}
</style>
