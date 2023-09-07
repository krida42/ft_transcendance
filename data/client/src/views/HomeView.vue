<template>
  <div class="home grid h-[100vh]">
    <div class="left">x: {{ mouseX }} y: {{ mouseY }}<br /></div>
    <div
      class="arcade min-h-[45rem] relative flex items-center flex-col justify-top"
    >
      <div id="a1" class="a_border a_left absolute"></div>
      <div id="a2" class="a_border a_left absolute"></div>
      <div id="a3" class="a_border a_left absolute"></div>
      <div class="a_border a_left_end absolute"></div>
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
      <div
        class="line w-[70%] h-[7px] absolute bottom-[27%] bg-[#74c69d]"
      ></div>
      <div id="a1" class="a_border a_right absolute"></div>
      <div id="a2" class="a_border a_right absolute"></div>
      <div id="a3" class="a_border a_right absolute"></div>
      <div class="a_border a_right_end absolute"></div>
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
const border_space = 28;
const { x: mouseX, y: mouseY } = useMouse();
const { width, height } = useWindowSize();
const leftPad = ref<HTMLElement | null>(null);
const rightPad = ref<HTMLElement | null>(null);
const leftPadPosition = ref<DOMRect | undefined>(undefined);
</script>

<style lang="scss" scoped>
.home {
  grid-template-columns: 1fr 50rem 1fr;
}
.arcade {
  background-color: #40916c;
}
.a_border {
  height: 100%;
  width: 66px;
  mask-size: 100% 100%;
}

.a_left {
  mask-image: url("../assets/svg/arcade_line_l.svg");
}
.a_right {
  mask-image: url("../assets/svg/arcade_line_r.svg");
}
.a_left_end {
  mask-image: url("../assets/svg/arcade_triangle_l.svg");
  background-color: #d8f3dc;
  width: 36px;
  left: 0;
}
.a_right_end {
  mask-image: url("../assets/svg/arcade_triangle_r.svg");
  background-color: #d8f3dc;
  width: 36px;
  right: 0;
}

#a1 {
  background-color: #74c69d;
}
#a2 {
  background-color: #95d5b2;
}
#a3 {
  background-color: #b7e4c7;
}
#a1.a_right {
  right: 62px;
}
#a2.a_right {
  right: 31px;
}
#a3.a_right {
  right: 0;
}

#a1.a_left {
  left: 62px;
}

#a2.a_left {
  left: 31px;
}
#a3.a_left {
  left: 0;
}
.middle_line {
  border: none;
  border-left: 3px dotted white;
}

@media (max-width: 640px) {
  .home {
    grid-template-columns: 0 1fr 0;
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
