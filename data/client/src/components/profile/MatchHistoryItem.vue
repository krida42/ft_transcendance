<template>
  <li class="match-item">
    <p
      :class="isWin ? 'text-green-dark' : 'text-red-my'"
      class="result text-[1.4rem]"
    >
      {{ result }}
    </p>
    <p class="score text-[1.4rem]">
      {{ scoreMe }}<span> / </span>{{ scoreOp }}
    </p>
    <p class="username text-[0.9rem] normal-case font-bold">{{ nameOp }}</p>
    <p class="time w-[100%] flex justify-center items-center gap-[0.5rem]">
      <span class="duration text-[0.9rem]">{{ matchDurationString }}</span>
      <span class="date text-[0.7rem]">{{ dateToString(date) }}</span>
    </p>
  </li>
</template>

<style lang="scss" scoped>
.match-item {
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 25% 15% 35% 25%;
  padding: 0.5rem 1rem;
}

.match-item::after {
  --width-after: 90%;

  content: "";
  position: absolute;
  left: calc((100% - var(--width-after)) / 2);
  bottom: 0;
  width: var(--width-after);
  border-bottom: 1px solid #828287;
}

.match-item > * {
  justify-self: center;
  align-self: center;
}

.time,
.username {
  font-family: "Roboto", sans-serif;
}

@media (max-width: 1200px) {
  .match-item {
    grid-template-columns: 25% 20% 40% 15%;
  }
  .date {
    display: none;
  }
}

@media (max-width: 1100px) {
  .match-item {
    grid-template-columns: 35% 20% 45%;
  }
  .duration {
    display: none;
  }
}

@media (max-width: 1050px) {
  .match-item {
    grid-template-columns: 25% 15% 35% 25%;
  }
  .duration,
  .date {
    display: block;
  }
}

@media (max-width: 680px) {
  .match-item {
    grid-template-columns: 33% 33% 34%;
  }
  .username {
    font-size: 0.9rem;
  }
  .score,
  .result {
    font-size: 1rem;
  }
  .duration,
  .date {
    display: none;
  }
}
</style>

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

  return `${hString}${mString}${sString}'`;
}

function dateToString(date: string) {
  if (!date) return "";
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
