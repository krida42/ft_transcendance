<template>
  <div class="home grid h-[100vh]">
    <div class="left">x: {{ mouseX }} y: {{ mouseY }}<br /></div>
    <div
      class="arcade min-h-[45rem] relative flex items-center flex-col justify-top"
    >
      <div class="arcade_border border_l absolute"></div>
      <h1>Pong</h1>
      <div
        class="pong_screen w-[85%] h-[40%] sm:w-[56%] sm:h-[40%] rounded-[40px] bg-black flex justify-between"
      >
        <div
          ref="leftPad"
          class="h-[15%] w-[1.5%] bg-white ml-[2.5rem] mt-[2.5rem]"
        ></div>
        <hr class="middle_line h-[80%] self-center" />
        <div
          class="pong_ball h-[0.5rem] w-[0.5rem] bg-white absolute right-[60%] top-[40%]"
        ></div>
        <div
          ref="rightPad"
          class="h-[15%] w-[1.5%] bg-white mr-[2.5rem] mb-[2.5rem] self-end"
        ></div>
      </div>
      <div class="line w-[70%] h-[7px] absolute bg-[#74c69d]"></div>
      <div class="arcade_border border_r absolute"></div>
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
const leftPad = ref<HTMLElement | null>(null);
const rightPad = ref<HTMLElement | null>(null);
const leftPadPosition = ref<DOMRect | undefined>(undefined);
</script>

<style lang="scss" scoped>
.home {
  grid-template-columns: 1fr minmax(40vw, 50rem) 1fr;
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
  width: 3rem;
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
  width: 6.5rem;
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

.border_l {
  left: 0;
}

.border_l::before {
  content: "";
  position: absolute;
  height: var(--border-ratio);
  width: 100%;
  top: 0;
  left: 0;
  background: var(--gradient);
  transform: skew(var(--border-angle-top));
}

.border_l::after {
  content: "";
  position: absolute;
  height: calc(100% - var(--border-ratio));
  width: 100%;
  bottom: 0;
  left: 0;
  background: var(--gradient);
  transform: skew(var(--border-angle-bot));
}
.border_r {
  right: 0;
}

.border_r::before {
  content: "";
  position: absolute;
  background: var(--gradient);
  width: 100%;
  height: var(--border-ratio);
  top: 0;
  right: 0;
  transform: skew(calc(-1 * var(--border-angle-top))) rotate(0.5turn);
}

.border_r::after {
  content: "";
  position: absolute;
  height: calc(100% - var(--border-ratio));
  width: 100%;
  bottom: 0;
  left: 0;
  background: var(--gradient);
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
