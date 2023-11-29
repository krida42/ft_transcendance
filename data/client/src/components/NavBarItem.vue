<template>
  <li
    @click="$router.push(route)"
    class="nav-bar-item"
    :class="$route.path === route ? 'bg-green-medium' : ''"
  >
    <img :src="require(`@/assets/svg/${iconName}`)" />
    <p>{{ category }}</p>
  </li>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps({
  category: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
li {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 12rem;
  padding: 0.5rem;
  border-radius: 15px;
}

li:hover {
  background-color: $green-medium;
  cursor: pointer;
}

li img {
  width: 1.8rem;
  height: 1.8rem;
}

li p {
  font-family: "Baumans", cursive;
  font-size: 1.4rem;
  color: black;
}
</style>
