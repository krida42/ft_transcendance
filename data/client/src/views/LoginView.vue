<template>
  <div class="login">
    <h1>Pong</h1>
    <div
      class="pong-screen w-[20rem] flex items-center flex-col justify-around rounded"
    >
      <p>Please sign in with 42 to continue</p>
      <button class="border-[3px] border-white">Sign in</button>
      <img src="../assets/svg/42_logo.svg" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.login {
  color: white;
  font-size: 2rem;
  font-family: "VT323", monospace;
  text-transform: uppercase;
}

.pong-screen {
  margin: auto;
  background-color: black;
}

img {
  width: 10rem;
}
</style>

<!-- font-family: 'Baumans', cursive;

font-family: 'Roboto', sans-serif;

font-family: 'VT323', monospace; -->
