<template>
  <div class="buttons"><button>Settings</button><button>Logout</button></div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps({
  mode: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.buttons {
  grid-area: buttons;
  background-color: $green-my;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--bento-gap);
}

.buttons > * {
  width: calc(100% - 2 * var(--bento-gap));
  height: calc(50% - 1.5 * var(--bento-gap));
  font-size: 1.5rem;
  text-transform: uppercase;
  background-color: $yellow-hover;
  border-radius: 20px;
  box-shadow: 1px 5px 4px -3px rgba(0, 0, 0, 0.5);
}

.buttons > *:hover {
  box-shadow: inset 3px 5px 4px -3px rgba(0, 0, 0, 0.5);
}
</style>
