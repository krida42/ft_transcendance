<!-- <Icon
      class="avatar bd-redd"
      :class="{
        'mr-1': props.!isMe,
        'ml-1 ': props.isMe,
      }"
      :size="props.avatar ? '22' : '0'"
      color="#eeeeee"
    >
      <UserCircle />
    </Icon> -->

<template>
  <div
    class="msg flex items-end w-[92%] bd-redd"
    :class="{
      'flex-row-reverse': isMe,
      'flex-row': !isMe,
      'self-start': !isMe,
      'self-end': isMe,
      'mb-3': pseudo,
      'mb-1': !pseudo,
      'opacity-30': ack === false,
    }"
  >
    <div
      v-if="avatar && !isMe"
      class="avatar bd-redd shrink-0"
      :class="{
        'mr-1': !isMe && avatar,
        'ml-1 ': isMe && avatar,
      }"
    >
      <img class="rounded-full" :src="avatar" width="22" />
    </div>
    <div
      v-else-if="!avatar && !isMe"
      class="w-[22px] bd-redd"
      :class="{
        'mr-1': !isMe,
        'ml-1 ': isMe,
      }"
    ></div>
    <div
      class="content bd-cyand p-2 rounded-t-xl"
      :class="{
        'rounded-ee-xl': !isMe || !avatar,
        'rounded-es-xl': isMe || !avatar,
        'rounded-xl': isMe,
        'bg-blue-light': !isMe,
        'bg-green-light': isMe,
      }"
    >
      <div class="header flex justify-between">
        <span class="pseudo bd-redd text-red-700">{{ props.pseudo }}</span>
        <span
          class="date text-xs bd-redd"
          :class="{
            'ml-3': true,
            // 'mr-3': isMe,
          }"
          >{{
            date?.toLocaleTimeString("en-UK", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}</span
        >
      </div>
      <div class="main">
        <p
          class="text bd-redd break-all whitespace-pre-line"
          :class="{
            'text-start': true,
          }"
        >
          {{ props.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Icon } from "@vicons/utils";
import { UserCircle } from "@vicons/tabler";

const props = defineProps({
  content: String,
  date: Date,
  isMe: Boolean,
  pseudo: String,
  avatar: String,
  ack: Boolean,
});
</script>
