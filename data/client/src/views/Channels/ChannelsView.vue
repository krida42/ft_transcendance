<template>
  <div class="channels">
    <div class="nav-ctn bg-green-dark">
      <MenuButton
        svgName="pong-logo.svg"
        @click="() => $router.push('/main/home')"
      />
      <ul class="nav">
        <li
          :class="$route.name === 'myChannels' ? 'bg-green-medium' : ''"
          class="my-channels-btn"
          @click="
            () => {
              $router.push('/channels/my-channels');
            }
          "
        >
          <img src="@/assets/svg/heart.svg" />
          <p>My channels</p>
        </li>
        <li
          :class="$route.name === 'exploreChannels' ? 'bg-green-medium' : ''"
          class="explore-btn"
          @click="
            () => {
              $router.push('/channels/explore');
            }
          "
        >
          <img src="@/assets/svg/explore.svg" />
          <p>Explore</p>
        </li>
        <li
          :class="$route.name === 'createChannel' ? 'bg-green-medium' : ''"
          class="create-btn"
          @click="
            () => {
              $router.push('/channels/create');
            }
          "
        >
          <img src="@/assets/svg/create.svg" />
          <p>Create</p>
        </li>
      </ul>
    </div>
    <div class="gradient"></div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MenuButton from "@/components/MenuButton.vue";
import { ref } from "vue";
</script>

<style lang="scss" scoped>
.channels {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(6rem, 0.4fr) 7fr;
  height: 100vh;
}

.nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.nav li {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 12rem;
  padding: 0.5rem;
  border-radius: 15px;
}

.nav li:hover {
  background-color: $green-medium;
  cursor: pointer;
}

.nav li img {
  width: 2rem;
  height: 2rem;
}

.nav li p {
  font-family: "Baumans", cursive;
  font-size: 1.4rem;
  color: black;
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
