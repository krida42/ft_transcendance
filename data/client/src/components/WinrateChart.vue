<template>
  <div class="winrate-chart">
    <div class="camembert" :style="cssProps">
      <svg>
        <circle cx="70" cy="70" r="70"></circle>
        <circle cx="70" cy="70" r="70"></circle>
      </svg>
      <div class="number">
        <h2 class="winrate">{{ winrate }}<span>%</span></h2>
        <h2 class="title">Winrate</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.winrate-chart {
  font-family: "Baumans", cursive;
  line-height: 1.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 300px;
  height: 400px;
}

.camembert {
  position: relative;
  width: 150px;
  height: 150px;
}

.camembert svg {
  position: relative;
  width: 150px;
  height: 150px;
}

.camembert svg circle {
  width: 150px;
  height: 150px;
  fill: none;
  stroke-width: 10;
  stroke: #000;
  transform: translate(5px, 5px);
  stroke-dasharray: 440;
  stroke-dashoffset: 440;
  /* stroke-linecap: round; */
}

.camembert svg circle:nth-child(1) {
  stroke: #da6c5d;
  stroke-dashoffset: 0;
}

.camembert svg circle:nth-child(2) {
  stroke: #74c69d;
  stroke-dashoffset: calc(440 - (440 * var(--winrate)) / 100);
}
.number {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(0.2rem, 0.8rem);
}

.winrate {
  font-size: 3rem;
}

.winrate span {
  font-size: 1.7rem;
}

.title {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  winrate: Number,
});
const cssProps = computed(() => {
  return { "--winrate": props.winrate };
});
</script>
