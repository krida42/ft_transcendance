<template>
  <ul class="nav-bar">
    <NavBarItem
      v-for="item in navItems"
      :key="item.category"
      :category="item.category"
      :route="item.route"
      :iconName="item.iconName"
    />
  </ul>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { NavItem } from "@/types";
import NavBarItem from "@/components/NavBarItem.vue";

defineProps({
  navItems: {
    type: Object as () => NavItem[],
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
