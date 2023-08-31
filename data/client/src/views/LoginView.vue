<template>
  <div class="login">
    <h1>Pong</h1>
    <div class="flex items-center flex-col justify-around">
      <p>Please sign in with 42 to continue</p>
      <button class="border-[3px] border-white">Sign in</button>
      <img class="w-[77px]" src="../assets/svg/42_logo.svg" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.login {
  background-color: $background-primary;
  color: black;
  font-size: 2rem;
  font-family: "VT323", monospace;
  text-transform: uppercase;
}
</style>

<!-- font-family: 'Baumans', cursive;

font-family: 'Roboto', sans-serif;

font-family: 'VT323', monospace; -->
