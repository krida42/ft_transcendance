<template>
  <div class="profile absolute top-[30%] left-[40%]">
    <WinrateChart :winrate="80"></WinrateChart>
  </div>
</template>

<script setup lang="ts">
import WinrateChart from "@/components/WinrateChart.vue";
</script>

<style scoped></style>
