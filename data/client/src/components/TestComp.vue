<template>
  <div class="bg-slate-100 ww-[100px] hw-[100px]">
    <h1>cousouß</h1>
    <header class="bg-red-200"><slot name="header"></slot></header>
    <main class="bg-red-300">
      <slot>je suis ici ci rien n est donnee</slot>
    </main>
    <footer class="bg-red-400"><slot name="footer"></slot></footer>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";

const cuicui = ref("cuicui");

const props = defineProps({
  msg: String,
});
</script>
