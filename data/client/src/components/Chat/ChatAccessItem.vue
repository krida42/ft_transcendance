<template>
  <!-- <li> -->
  <li
    class="bd-redd flex justify-between items-center w-1/1 py-3 px-3 my-[2px] bg-[#FFFDF2] bg-opacity-60 hover:bg-blue-200 cursor-pointer"
    :class="{
      'rounded-t-[8px]': start,
      'rounded-b-[8px]': end,
    }"
  >
    <div class="avatar bd-blued flex">
      <!-- <Icon class="bdd-red h-1/1" size="30">
        <UserCircle />
      </Icon> -->
      <img class="h-1/1 w-1/1 rounded-full w-[30px]" :src="avatar" />
    </div>
    <div class="name bd-redd pt-1 w-[56%] truncate">
      {{ title }}
    </div>

    <!-- <div class="chat-btn bd-blue" style="text-align: center"> -->
    <button class="bd-cydan flex">
      <Icon class="bdd-red h-[100%]" size="20" @click="console.log">
        <Message />
      </Icon>
    </button>
    <!-- </div> -->

    <div
      class="status w-2 h-2 border-1 border-black rounded-full"
      :class="{
        'bg-green-700': status === 'online',
        'bg-red-700': status === 'offline',
        'bg-blue-700': status === 'inGame',
      }"
    ></div>
  </li>
  <!-- </li> -->
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { UserCircle, Message } from "@vicons/tabler";
import { defineProps } from "vue";

// type Pos = "start" | "end" | "solo";
// type Status = "online" | "offline";

const props = defineProps({
  status: String,
  start: Boolean,
  end: Boolean,
  title: String,
  chatId: String,
  avatar: String,
});
void props;
</script>
