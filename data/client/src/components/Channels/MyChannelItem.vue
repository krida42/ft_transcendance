<template>
  <div class="my-channel-item relative text-[1.2rem] pt-[1rem] pb-[1rem]">
    <img
      src="@/assets/svg/unknown-img.svg"
      class="unknown-logo w-[2.4rem] aspect-square"
    />
    <img
      src="@/assets/svg/crown.svg"
      class="crown w-[1.6rem] aspect-square"
      :class="channel.is_owner ? 'visible' : 'invisible'"
    />
    <p>{{ channel?.name }}</p>
    <div class="members flex items-center gap-[0.5rem]">
      <img src="@/assets/svg/profile.svg" class="w-[1.6rem]" />
      <p>{{ channel?.members.length }}</p>
    </div>
    <button class="rounded-[10px] bg-yellow-hover px-[0.5rem] py-[0.4rem]">
      {{ button_text }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { computed } from "vue";

const channel = defineProps({
  id: String,
  index: Number,
  name: String,
  logo: String,
  members: Array,
  is_owner: Boolean,
  len: Number,
});

const button_text = computed(() => {
  return channel.is_owner ? "settings" : "leave";
});
</script>

<style lang="scss" scoped>
.my-channel-item {
  font-family: "Baumans", cursive;
  display: grid;
  grid-template-columns: 1fr 0.5fr 2fr 1fr 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
}

.my-channel-item::after {
  content: "";
  bottom: 0;
  position: absolute;
  width: 90%;
  height: 1px;
  border-bottom: 1px solid black;
}
</style>
