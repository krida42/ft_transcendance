<template>
  <div class="home grid h-[100vh]">
    <div class="left"></div>
    <div
      class="arcade min-h-[45rem] relative flex items-center flex-col justify-top"
    >
      <h1>Pong</h1>
      <div class="pong-screen w-[67%] h-[40%] rounded-[40px] bg-black"></div>
      <div
        class="line w-[100%] h-[5px] absolute bottom-[27%] bg-blue-light"
      ></div>
    </div>
    <div class="right"></div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss">
.home {
  grid-template-columns: 1fr minmax(40rem, 50vw) 1fr;
}

.arcade {
  background-color: #75afd0;
}
.arcade::before,
.arcade::after {
  content: "";
  position: absolute;
  background-color: $blue-light;
  height: 100%;
  width: 50px;
}
.arcade::before {
  mask-image: url("../assets/svg/arcade_mask_left.svg");
  mask-size: 100% 100%;
  left: 0;
}
.arcade::after {
  mask-image: url("../assets/svg/arcade_mask_right.svg");
  mask-size: 100% 100%;
  right: 0;
}

@media (max-width: 640px) {
  html {
    font-size: 62.5%;
  }
  .home {
    grid-template-columns: 0 1fr 0;
  }
  .arcade::before,
  .arcade::after {
    display: none;
  }
}
</style>
