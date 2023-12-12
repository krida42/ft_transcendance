<template>
  <div class="buttons">
    <button @click="$emit('button1')">
      {{
        mode === profileModes.myProfile ? "Settings" : "Add as friend"
      }}</button
    ><button @click="$emit('button2')">
      {{ mode === profileModes.myProfile ? "Logout" : "Block" }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { PropType, defineProps } from "vue";
import { profileModes } from "@/types";

defineProps({
  mode: {
    type: String as PropType<profileModes>,
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

@media (max-width: 680px) {
  .buttons {
    flex-direction: row;
  }

  .buttons > * {
    width: calc(50% - 1.5 * var(--bento-gap));
    height: calc(100% - 2 * var(--bento-gap));
  }
}
</style>
