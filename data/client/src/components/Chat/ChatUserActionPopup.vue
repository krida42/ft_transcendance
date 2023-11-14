<template>
  <div
    class="chat-user-action-popup grid grid-rows-2 w-[18rem] h-[9rem] bg-black bg-opacity-80 rounded-xl text-white px-5 py-3"
  >
    <div class="user-info dbg-green-200 grid grid-cols-12 gap-x-3 items-center">
      <div class="user-avatar col-span-3 border-red-900 border-2d">
        <img
          src="https://cdn.intra.42.fr/users/95f9dafeb1e78d2374207ab32c186d31/kisikaya.jpg"
          alt="avatar"
          class="rounded-full w-[92%] mx-auto"
        />
      </div>
      <p
        class="user-name dbd-blue truncate col-span-8 self-center px-3 text-start"
      >
        Bibi
      </p>
      <Icon
        size="1.8rem"
        class="bd-blues self-start justify-self-end relative right-[-0.6rem] top-[-0.4rem]"
      >
        <X />
      </Icon>
    </div>
    <div class="actions flex justify-around dbg-red-200 items-center">
      <button class="hover:bg-gray-500">ADD FRIEND</button>
      <button class="text-red-my hover:bg-[#7c2c2c]">BLOCK</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { User, X } from "@vicons/tabler";
</script>

<style lang="scss" scoped>
.chat-user-action-popup {
  font-family: "Baumans";
}

button {
  //   background: #7c2c2c;
  border: 1px solid white;
  border-radius: 0.5rem;
  width: 45%;
  margin-top: 0.4rem;
  //   margin-bottom: 1rem;
  height: 2.3rem;
}
</style>
