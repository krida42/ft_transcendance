<template>
  <form
    @submit.prevent="sendForm"
    class="create-channel min-h-[100vh] flex flex-col justify-evenly items-center"
  >
    <div
      class="general-options w-[90%] h-[20vh] flex justify-start items-center gap-[2rem] px-[2rem] pb-[2rem] border-b-2 border-black"
    >
      <div class="chan-logo flex items-center gap-[1rem]">
        <img
          src="@/assets/svg/unknown-img.svg"
          class="aspect-square w-[8rem]"
        />
        <img src="@/assets/svg/pen.svg" class="pen" />
      </div>
      <div class="chan-name flex items-center gap-[1rem]">
        <input
          type="text"
          placeholder="channel name"
          class="w-[15rem] h-[3rem] rounded-[15px] bg-transparent text-black text-[2rem] pl-[1rem]"
        />
        <img src="@/assets/svg/pen.svg" class="pen" />
      </div>
    </div>
    <div class="privacy-status flex gap-[2rem] self-start ml-[3rem]">
      <div class="radio-btn">
        <input
          type="radio"
          id="private"
          name="private"
          value="private"
          checked
        />
        <label for="private">private</label>
      </div>
      <div class="radio-btn">
        <input type="radio" id="public" name="public" value="public" />
        <label for="public">public</label>
      </div>
      <div class="radio-btn">
        <input type="radio" id="protected" name="protected" value="protected" />
        <label for="protected">protected</label>
      </div>
    </div>
    <div class="chan-options min-h-[25rem] h-[50vh] w-[100%] px-[3rem]">
      <div class="w-[100%] h-[100%] bg-green-light rounded-[15px]"></div>
    </div>
    <div class="submit-btn w-[90%] flex justify-end">
      <button
        type="submit"
        class="bg-yellow-hover rounded-[15px] px-[1rem] h-[3rem] text-[1.5rem] text-black uppercase"
        @click="sendForm"
      >
        create
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import channel from "@/api/channel";
import { ref } from "vue";

const channelName = ref("");
const sendForm = () => {
  console.log(channelName.value);
};
</script>

<style lang="scss" scoped>
.pen {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}
.radio-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
}

button {
  font-family: "Baumans", cursive;
}
</style>
