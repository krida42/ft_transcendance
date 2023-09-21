<!-- <Icon
      class="avatar bd-redd"
      :class="{
        'mr-1': props.direction === 'in',
        'ml-1 ': props.direction === 'out',
      }"
      :size="props.avatar ? '22' : '0'"
      color="#eeeeee"
    >
      <UserCircle />
    </Icon> -->

<template>
  <div
    class="msg flex items-end my-3 w-[92%] bd-redd"
    :class="{
      'flex-row-reverse': direction === 'out',
      'flex-row': direction === 'in',
      'self-start': direction === 'in',
      'self-end': direction === 'out',
    }"
  >
    <div
      v-if="avatar"
      class="avatar bd-redd"
      :class="{
        'mr-1': direction === 'in' && avatar,
        'ml-1 ': direction === 'out' && avatar,
      }"
    >
      <img class="rounded-full" :src="avatar" width="40" />
    </div>
    <div
      class="content bd-cyand p-2 rounded-t-xl"
      :class="{
        'rounded-ee-xl': direction === 'in' || !avatar,
        'rounded-es-xl': direction === 'out' || !avatar,
        'bg-blue-light': direction === 'in',
        'bg-green-light': direction === 'out',
      }"
    >
      <div class="header flex justify-between">
        <span class="pseudo bd-redd text-red-700">{{ props.pseudo }}</span>
        <span class="date text-xs bd-redd">{{
          props.date?.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}</span>
      </div>
      <div class="main">
        <p class="text bd-redd text-start break-all">
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
  direction: String,
  pseudo: String,
  avatar: String,
});
</script>
