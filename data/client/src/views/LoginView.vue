<template>
  <div class="login text-white uppercase">
    <h1 class="pb-[1rem]">Pong</h1>
    <div
      class="pong-screen w-[38rem] h-[26rem] m-auto rounded-[53px] bg-black flex items-center flex-col justify-center"
    >
      <p class="leading-none">
        Please sign in with <br />
        42 to continue
      </p>
      <button class="py-0 px-[1rem] border-2 border-white uppercase">
        Sign in
      </button>
      <img class="w-[4rem]" src="../assets/svg/42_logo.svg" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.login {
  font-size: 1.8rem;
  font-family: "VT323", monospace;
}

.pong-screen {
  gap: 2.5rem;
}

button:hover {
  background-color: white;
  color: black;
}

@media (max-width: 42rem) {
  .pong-screen {
    width: 90vw;
    height: 70vw;
  }
  .pong-screen {
    gap: 6vw;
  }
}
</style>

<!-- font-family: 'Baumans', cursive;

font-family: 'Roboto', sans-serif;

font-family: 'VT323', monospace; -->
