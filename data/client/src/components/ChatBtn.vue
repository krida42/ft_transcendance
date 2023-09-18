<template>
  <!-- <li> -->
  <li
    class="bd-redd flex justify-between items-center w-1/1 py-3 px-3 my-1 bg-[#FFFDF2] bg-opacity-40 hover:bg-blue-200 cursor-pointer"
    :class="{
      'rounded-t-[16px]': start,
      'rounded-b-[16px]': end,
    }"
  >
    <div class="avatar bd-blued flex">
      <Icon class="bdd-red h-1/1" size="30">
        <UserCircle />
      </Icon>
    </div>
    <div class="name bd-redd pt-1 w-[56%] truncate">
      <slot></slot>
    </div>

    <!-- <div class="chat-btn bd-blue" style="text-align: center"> -->
    <button class="bd-cydan flex">
      <Icon class="bdd-red h-[100%]" size="20" @click="console.log">
        <Message />
      </Icon>
    </button>
    <!-- </div> -->

    <div
      class="status w-2 h-2 border-1 border-black rounded-full bg-red-700d"
      :class="{
        'bg-green-700': status === 'online',
        'bg-red-700': status === 'offline',
      }"
    ></div>
  </li>
  <!-- </li> -->
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { UserCircle, Message, Circle } from "@vicons/tabler";
import { defineProps } from "vue";

type Pos = "start" | "end" | "solo";
type Status = "online" | "offline";

const props = defineProps({
  status: String,
  start: Boolean,
  end: Boolean,
});
</script>
