<template>
  <div class="channel-settings">
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
import router from "@/router";
import { NavItem } from "@/types";
import { onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";
import MenuButton from "@/components/MenuButton.vue";

const channelId = router.currentRoute.value.params.channelId;

const navItems: NavItem[] = [
  {
    category: "General",
    route: `/channels/${channelId}/settings/general`,
    iconName: "settings.svg",
  },
  {
    category: "Members",
    route: `/channels/${channelId}/settings/members`,
    iconName: "profile.svg",
  },
  {
    category: "Bans",
    route: `/channels/${channelId}/settings/bans`,
    iconName: "blocked.svg",
  },
];
</script>

<style lang="scss" scoped>
.channel-settings {
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
