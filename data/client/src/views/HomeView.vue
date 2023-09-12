<template>
  <div class="home grid">
    <div class="left"></div>
    <div
      class="arcade min-h-[45rem] relative flex items-center flex-col justify-top"
    >
      <div class="arcade_border border_l left-0 absolute"></div>
      <h1>Pong</h1>
      <div
        ref="pongScreen"
        class="pong_screen w-[85%] h-[40%] sm:w-[56%] sm:h-[40%] rounded-[40px] bg-black flex justify-between drop-shadow-lg"
      >
        <div
          ref="pad"
          class="h-[15%] w-[1.5%] bg-white ml-[2.5rem] mt-[30px]"
          v-bind="{
            style: {
              transform: `translateY(${leftPadTranslate}px)`,
            },
          }"
        ></div>
        <hr class="middle_line h-[80%] self-center" />
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
          class="h-[15%] w-[1.5%] bg-white mr-[2.5rem] mb-[30px] self-end"
          v-bind="{
            style: {
              transform: `translateY(${rightPadTranslate}px)`,
            },
          }"
        ></div>
      </div>
      <div class="line w-[75%] h-[7px] absolute bg-[#74c69d]"></div>
      <div class="arcade_border border_r right-0 absolute"></div>
    </div>
    <div class="right"></div>
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
const { x: mouseX, y: mouseY } = useMouse();
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
  { debounce: 200 }
);
const leftPadTranslate = ref<number>(0);
const rightPadTranslate = ref<number>(0);
const ballTranslateX = ref<number>(0);
const ballTranslateY = ref<number>(0);

throttledWatch(
  [mouseY],
  ([y]) => {
    if (pongScreenPos.value && padPos.value && ballPos.value) {
      leftPadTranslate.value =
        (y / height.value) *
        (pongScreenPos.value.height - padPos.value.height - 60);
      rightPadTranslate.value =
        -(y / height.value) *
        (pongScreenPos.value.height - padPos.value.height - 60);
      ballTranslateX.value =
        (y / height.value) *
        (pongScreenPos.value.width - ballPos.value.width - 120);
      ballTranslateY.value =
        (y / height.value) *
        (pongScreenPos.value.height - ballPos.value.height - 120);
    }
  },
  { throttle: 1000 / 60 } //60fps
);
</script>

<style lang="scss" scoped>
.home {
  grid-template-columns: 1fr minmax(40vw, 52rem) 1fr;
}

.arcade {
  --border-ratio: 70%;
  background-color: #40916c;
  z-index: -2;
}

.arcade::before,
.arcade::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 6rem;
  mask-size: 100% 100%;
  background-color: $green-bg;
}

.arcade::after {
  right: 0;
  z-index: -1;
  mask-image: url("../assets/svg/arcade_triangle_r.svg");
}

.arcade::before {
  left: 0;
  mask-image: url("../assets/svg/arcade_triangle_l.svg");
}

.line {
  top: var(--border-ratio);
}

.arcade_border {
  height: 100%;
  width: 6rem;
  --gradient: linear-gradient(
    to right,
    #b7e4c7 33%,
    #95d5b2 33%,
    #95d5b2 66%,
    #74c69d 66%,
    #74c69d 100%
  );
  --border-angle-top: 6.1deg;
  --border-angle-bot: -14deg;
}

.border_l::before,
.border_l::after {
  content: "";
  position: absolute;
  width: 100%;
  left: 0;
  background: var(--gradient);
}

.border_l::before {
  height: var(--border-ratio);
  top: 0;
  transform: skew(var(--border-angle-top));
}

.border_l::after {
  height: calc(100% - var(--border-ratio));
  bottom: 0;
  transform: skew(var(--border-angle-bot));
}

.border_r::before,
.border_r::after {
  content: "";
  position: absolute;
  background: var(--gradient);
  width: 100%;
  right: 0;
}

.border_r::before {
  height: var(--border-ratio);
  top: 0;
  transform: skew(calc(-1 * var(--border-angle-top))) rotate(0.5turn);
}

.border_r::after {
  height: calc(100% - var(--border-ratio));
  bottom: 0;
  transform: skew(calc(-1 * var(--border-angle-bot))) rotate(0.5turn);
}

.middle_line {
  border: none;
  border-left: 3px dotted white;
}

@media (max-width: 640px) {
  .home {
    grid-template-columns: 0 1fr 0;
  }

  .arcade_border {
    display: none;
  }

  .arcade::before,
  .arcade::after {
    display: none;
  }

  .line {
    display: none;
  }
}
</style>
