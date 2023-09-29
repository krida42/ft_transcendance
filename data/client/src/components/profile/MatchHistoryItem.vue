<template>
  <li class="flex justify-evenly">
    <h2>{{ result }}</h2>
    <p>{{ scoreMe }}<span> / </span>{{ scoreOp }}</p>
    <p>{{ duration }}</p>
    <p>{{ date }}</p>
  </li>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { defineProps } from "vue";
const match = defineProps({
  id: String,
  result: String,
  scoreMe: Number,
  scoreOp: Number,
  duration: Number,
  date: String,
});
</script>
