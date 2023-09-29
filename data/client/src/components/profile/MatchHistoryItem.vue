<template>
  <li class="w-[100%] flex justify-evenly">
    <p :class="isWin ? 'text-green-dark' : 'text-red-my'" class="text-[1.2rem]">
      {{ result }}
    </p>
    <p>{{ scoreMe }}<span> / </span>{{ scoreOp }}</p>
    <p>{{ nameOp }}</p>
    <p class="lowercase">{{ matchDurationString }}</p>
    <p>{{ dateToString(date) }}</p>
  </li>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { defineProps } from "vue";
type time = { h: number; m: number; s: number };
const match = defineProps({
  id: String,
  scoreMe: Number,
  scoreOp: Number,
  nameOp: String,
  duration: Number,
  date: String,
});

function toHoursAndMinutes(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { h: hours, m: minutes, s: seconds };
}

function timeToString(time: time) {
  const { h, m, s } = time;
  const hString = h < 10 ? (h === 0 ? `` : `0${h}:`) : `${h}:`;
  const mString = m < 10 ? (m === 0 ? `` : `0${m}:`) : `${m}:`;
  const sString = s < 10 ? `0${s}` : `${s}`;

  return `${hString}${mString}${sString}s`;
}

function dateToString(date: string) {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();

  return `${day}/${month}/${year}`;
}

const matchDurationString = timeToString(toHoursAndMinutes(match.duration));
const result = match.scoreMe > match.scoreOp ? "Victory" : "Defeat";
const isWin = match.scoreMe > match.scoreOp ? true : false;
</script>
