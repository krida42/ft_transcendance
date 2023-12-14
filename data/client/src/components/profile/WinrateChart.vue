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

<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  winrate: {
    type: Number,
    required: true,
  },
});

const cssProps = computed(() => {
  return {
    "--pieEndPos": Math.round(440 - (440 * props.winrate) / 100),
  };
});
</script>

<style lang="scss" scoped>
.winrate-chart {
  --width: 160px;
  --height: 160px;

  font-family: "Baumans", cursive;
  line-height: 1.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: var(--width);
  height: var(--height);
}

.camembert {
  position: relative;
  width: var(--width);
  height: var(--height);
}

.camembert svg {
  position: relative;
  width: var(--width);
  height: var(--height);
  transform: rotate(90deg);
}

.camembert svg circle {
  width: var(--width);
  height: var(--height);
  fill: none;
  stroke-width: 14;
  stroke: #000;
  transform: translate(7px, 7px);
  stroke-dasharray: 440;
  stroke-dashoffset: 440;
}

.camembert svg circle:nth-child(1) {
  stroke: $red-my;
  stroke-dashoffset: 0;
}

.camembert svg circle:nth-child(2) {
  stroke: $green-my;
  stroke-dashoffset: 440;
  animation: dash 2s ease-out forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: var(--pieEndPos);
  }
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
  transform: translate(0, 0.6rem);
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
