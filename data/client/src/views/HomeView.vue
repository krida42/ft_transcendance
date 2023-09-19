<template>
  <div class="home">
    <div class="left">
      <MenuButton class="left-[2rem] top-[2rem]" svgName="pong-logo.svg" />
    </div>
    <div class="arcade">
      <div class="arcade_border border_l"></div>
      <h1>Pong</h1>
      <div ref="pongScreen" class="pong_screen">
        <div
          ref="pad"
          class="right_pad h-[15%] w-[1.5%] bg-white ml-[2.5rem] mt-[30px]"
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
          class="left_pad h-[15%] w-[1.5%] bg-white mr-[2.5rem] mb-[30px] self-end"
          v-bind="{
            style: {
              transform: `translateY(${rightPadTranslate}px)`,
            },
          }"
        ></div>
      </div>
      <div class="line"></div>
      <div class="arcade_border border_r"></div>
      <div
        class="pong_buttons w-[65%] absolute top-[76%] flex justify-center gap-[35%]"
      >
        <PongButton :angle="90">Play with friends</PongButton>
        <PongButton :angle="-90">Play random game</PongButton>
      </div>
    </div>
    <div class="right">
      <MenuButton class="right-[2rem] top-[2rem]" svgName="profile.svg" />
      <MenuButton class="right-[2rem] bottom-[2rem]" svgName="message.svg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PongButton from "@/components/PongButton.vue";
import MenuButton from "@/components/MenuButton.vue";
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
  display: grid;
  grid-template-columns: 1fr minmax(40vw, 50rem) 1fr;
  height: 100vh;
}

.arcade {
  --border-ratio: 70%;
  background-color: $green-dark;
  min-height: 45rem;
  max-height: 60rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  gap: 1rem;
}

.pong_screen {
  width: 65%;
  height: 40%;
  border-radius: 40px;
  background-color: black;
  display: flex;
  justify-content: space-between;
  filter: drop-shadow(5px 10px 10px rgb(0 0 0 / 0.3));
}

.line {
  width: 80%;
  height: 7px;
  position: absolute;
  background-color: $green-my;
  top: var(--border-ratio);
}

.arcade_border {
  position: absolute;
  height: 100%;
  width: 7rem;
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
  transform: translateX(-110px);
}
.border_l::before,
.border_l::after {
  content: "";
  position: absolute;
  width: 100%;
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

.border_r {
  right: 0;
}
.border_r::before,
.border_r::after {
  content: "";
  position: absolute;
  background: var(--gradient);
  width: 100%;
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
  height: 80%;
  align-self: center;
}

// @media (min-height: 900px) {
//   .home {
//     grid-template-rows: 1vh 1fr 1vh;
//     grid-template-columns: 1fr minmax(40vw, 50rem) 1fr;
//   }
//   .arcade {
//     grid-row-start: 2;
//     grid-column-start: 2;
//   }
// }

@media (max-width: 640px) {
  .home {
    grid-template-columns: 0 1fr 0;
  }

  .pong_screen {
    width: 85%;
    height: 45%;
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
