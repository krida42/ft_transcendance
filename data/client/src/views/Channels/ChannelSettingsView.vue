<template>
  <div class="channel-settings">
    <NavBar :navItems="navItems" />
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { NavItem } from "@/types";
import { onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";

const channelId = router.currentRoute.value.params.channelId;

const navItems: NavItem[] = [
  {
    category: "General",
    route: "/channels/",
    iconName: "settings.svg",
  },
  {
    category: "Members",
    route: "/channels/explore",
    iconName: "profile.svg",
  },
];

onMounted(() => {
  console.log(channelId);
});
</script>

<style lang="scss" scoped>
.channel-settings {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(6rem, 0.4fr) 7fr;
  height: 100vh;
}
</style>
