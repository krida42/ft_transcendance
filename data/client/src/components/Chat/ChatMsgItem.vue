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
      'mb-3': !solo,
      'mb-1': solo,
      'opacity-30': ack === false,
    }"
  >
    <div
      v-if="!solo && !isMe"
      class="avatar bd-redd shrink-0 cursor-pointer"
      :class="{
        'mr-1': !isMe && avatar,
        'ml-1 ': isMe && avatar,
      }"
      @click="emits('click-avatar')"
    >
      <img class="rounded-full" :src="avatar" width="22" />
    </div>
    <div
      v-else-if="solo && !isMe"
      class="w-[22px] bd-redd shrink-0"
      :class="{
        'mr-1': !isMe,
        'ml-1 ': isMe,
      }"
    ></div>
    <div
      class="content bd-cyand p-2 rounded-t-xl"
      :class="{
        'rounded-ee-xl': !isMe || solo,
        'rounded-es-xl': isMe || solo,
        'rounded-xl': isMe,
        'bg-blue-light': !isMe,
        'bg-green-light': isMe,
      }"
    >
      <div class="header flex justify-between" v-if="!solo">
        <span
          class="pseudo bd-redd text-red-700 cursor-pointer"
          @click="emits('click-avatar')"
          >{{ props.pseudo }}</span
        >
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

<style lang="scss" scoped>
// @keyframes avatar-keyframes {
//   0% {
//     transform: scale(0);
//   }
//   100% {
//     transform: scale(1);
//   }
// }

// .avatar-anim-enter-active {
//   animation: avatar-keyframes 4s; //ease-in-out;
// }

// .avatar-anim-leave-active {
//   animation: avatar-keyframes 10s; //ease-in-out reverse;
// }

// .header-anim-enter-active {
//   animation: header-keyframes 1s ease-in-out;
// }

// .header-anim-leave-active {
//   animation: header-keyframes 0.2s reverse;
// }

// @keyframes header-keyframes {
//   0% {
//     // transform: scale(0);
//     opacity: 0;
//     font-size: 0px;
//     height: 0px;
//     padding: 0;
//     margin: 0;
//   }

//   100% {
//     height: 0;
//     opacity: 0;
//   }
// }
</style>

<script lang="ts" setup>
import { defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  content: String,
  date: Date,
  isMe: Boolean,
  pseudo: String,
  avatar: String,
  ack: Boolean,
  solo: Boolean,
});

const emits = defineEmits(["mounted", "click-avatar"]);

onMounted(() => {
  emits("mounted");
});
</script>
