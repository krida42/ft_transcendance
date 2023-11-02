<template>
  <div
    class="explore-channels min-h-[100vh] flex flex-col items-center justify-around gap-[2rem]"
  >
    <form
      @submit.prevent="sendForm"
      class="relative bg-yellow-hover rounded-[15px] w-[90%] h-[2rem] mt-[2rem]"
    >
      <input
        v-model="channelName"
        placeholder="search for channel..."
        type="text"
        minlength="3"
        maxlength="15"
        class="w-[100%] h-[100%] rounded-[15px] bg-transparent text-black text-[1.2rem] pl-[1rem]"
      />
      <img
        src="@/assets/svg/search-icon-black.svg"
        class="absolute aspect-square w-[1.5rem] right-[1rem] top-[0.25rem] cursor-pointer"
        @click="sendForm"
      />
    </form>
    <div class="title w-[25rem]">
      <h1 class="text-[2rem] pb-[1rem]">Most popular channels</h1>
      <hr class="border-t-2 border-black" />
    </div>
    <div
      class="channels-ctn min-h-[25rem] h-[74vh] w-[100%] px-[3rem] pb-[3rem]"
    >
      <div class="w-[100%] h-[100%] bg-green-light rounded-[15px]"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import channel from "@/api/channel";
import { ref } from "vue";

const channelName = ref("");
const sendForm = () => {
  console.log(channelName.value);
};
</script>

<style scoped lang="scss"></style>
