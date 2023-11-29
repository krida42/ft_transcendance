<template>
  <div class="channels">
    <div class="nav-ctn bg-green-dark">
      <MenuButton
        svgName="pong-logo.svg"
        @click="() => $router.push('/main/home')"
      />
      <NavBar :navItems="navItems" />
    </div>
    <div class="gradient"></div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MenuButton from "@/components/MenuButton.vue";
import NavBar from "@/components/NavBar.vue";
import { NavItem } from "@/types";

const navItems: NavItem[] = [
  {
    category: "My channels",
    route: "/channels/my-channels",
    iconName: "heart.svg",
  },
  {
    category: "Explore",
    route: "/channels/explore",
    iconName: "explore.svg",
  },
  {
    category: "Create",
    route: "/channels/create",
    iconName: "create.svg",
  },
];
</script>

<style lang="scss" scoped>
.channels {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(6rem, 0.4fr) 7fr;
  height: 100vh;
}
.gradient {
  background: linear-gradient(
    to left,
    #b7e4c7 33%,
    #95d5b2 33%,
    #95d5b2 66%,
    #74c69d 66%,
    #74c69d 100%
  );
}
</style>
