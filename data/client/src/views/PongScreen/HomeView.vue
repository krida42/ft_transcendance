<template>
  <div ref="pongScreen" class="pong-screen flex justify-between">
    <div
      ref="pad"
      class="left_pad h-[15%] w-[1.5%] bg-white ml-[2.5rem] mt-[30px]"
      v-bind="{
        style: {
          transform: `translateY(${leftPadTranslate}px)`,
        },
      }"
    ></div>
    <hr class="middle_line" />
    <div
      ref="ball"
      class="pong_ball h-[0.5rem] w-[0.5rem] bg-white absolute top-[50px] left-[60px]"
      v-bind="{
        style: {
          transform: `translateY(${ballTranslateY}px) translateX(${ballTranslateX}px)`,
        },
      }"
    ></div>
    <div
      class="right_pad h-[15%] w-[1.5%] bg-white mr-[2.5rem] mb-[30px] self-end"
      v-bind="{
        style: {
          transform: `translateY(${rightPadTranslate}px)`,
        },
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {
  useMouse,
  useWindowSize,
  debouncedWatch,
  throttledWatch,
} from "@vueuse/core";
import { ref, onMounted } from "vue";
// App.vue > script
const { y: mouseY } = useMouse();
const { width, height } = useWindowSize();
const pongScreen = ref<HTMLElement | null>(null);
const pongScreenPos = ref<DOMRect | undefined>(undefined);
const pad = ref<HTMLElement | null>(null);
const padPos = ref<DOMRect | undefined>(undefined);
const ball = ref<HTMLElement | null>(null);
const ballPos = ref<DOMRect | undefined>(undefined);

onMounted(() => {
  pongScreenPos.value = pongScreen?.value?.getBoundingClientRect();
  padPos.value = pad?.value?.getBoundingClientRect();
  ballPos.value = ball?.value?.getBoundingClientRect();
});

debouncedWatch(
  [width, height],
  () => {
    pongScreenPos.value = pongScreen?.value?.getBoundingClientRect();
    padPos.value = pad?.value?.getBoundingClientRect();
    ballPos.value = ball?.value?.getBoundingClientRect();
  },
  { debounce: 100 }
);
const leftPadTranslate = ref<number>(0);
const rightPadTranslate = ref<number>(0);
const ballTranslateX = ref<number>(0);
const ballTranslateY = ref<number>(0);

throttledWatch(
  [mouseY],
  ([y]) => {
    if (pongScreenPos.value && padPos.value && ballPos.value) {
      const padPosHCorrected = padPos.value.height - window.scrollY;
      const pongScreenPosHCorrected =
        pongScreenPos.value.height - window.scrollY;
      const pongScreenPosWCorrected =
        pongScreenPos.value.width - window.scrollY;
      const ballPosHCorrected = ballPos.value.height - window.scrollY;
      const ballPosWCorrected = ballPos.value.width - window.scrollY;

      leftPadTranslate.value =
        (y / height.value) * (pongScreenPosHCorrected - padPosHCorrected - 60);
      rightPadTranslate.value =
        -(y / height.value) * (pongScreenPosHCorrected - padPosHCorrected - 60);
      ballTranslateX.value =
        (y / height.value) *
        (pongScreenPosWCorrected - ballPosWCorrected - 120);
      ballTranslateY.value =
        (y / height.value) *
        (pongScreenPosHCorrected - ballPosHCorrected - 120);
    }
  },
  { throttle: 1000 / 60 } //60fps
);
</script>

<style lang="scss" scoped>
.middle_line {
  border: none;
  border-left: 3px dotted white;
  height: 80%;
  align-self: center;
}
</style>
