<template>
  <div class="home">
    <div class="left">
      <MenuButton
        svgName="pong-logo.svg"
        @click="() => $router.push('/main/home')"
      />
    </div>
    <div class="arcade">
      <div class="arcade_border border_l"></div>
      <h1>Pong</h1>
      <router-view></router-view>
      <div class="line"></div>
      <div class="arcade_border border_r"></div>
      <div
        class="pong_buttons w-[65%] absolute top-[76%] flex justify-center gap-[35%]"
      >
        <ArcadeButton :angle="90" @pongClick="checkFriends()"
          >Play with friends</ArcadeButton
        >
        <ArcadeButton :angle="-90">Play random game</ArcadeButton>
      </div>
    </div>
    <div class="right flex flex-col items-end justify-between">
      <MenuButton
        svgName="profile.svg"
        @click="() => $router.push('/profile')"
      />
      <router-link to="/about">
        <MenuButton svgName="message.svg" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFriendStore } from "@/stores/friend";
import ArcadeButton from "@/components/ArcadeButton.vue";
import MenuButton from "@/components/MenuButton.vue";
import router from "@/router/index";
import { onMounted } from "vue";

const friendStore = useFriendStore();

async function checkFriends() {
  await friendStore.refreshFriendList();
  console.log("la", friendStore.friendsMap.size);
  if (friendStore.friends.size === 0) {
    router.push("/main/friendless");
  } else {
    router.push("/main/friend-play");
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1fr minmax(40vw, 50rem) 1fr;
  height: 100vh;
}

.arcade {
  --border-ratio: 70%;
  background-color: $green-dark;
  min-height: 45rem;
  max-height: 60rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  gap: 1%;
}

.line {
  width: 80%;
  height: 7px;
  position: absolute;
  background-color: $green-my;
  top: var(--border-ratio);
}

.arcade_border {
  position: absolute;
  height: 100%;
  width: 7rem;
  --gradient: linear-gradient(
    to right,
    #b7e4c7 33%,
    #95d5b2 33%,
    #95d5b2 66%,
    #74c69d 66%,
    #74c69d 100%
  );
  --border-angle-top: 6.1deg;
  --border-angle-bot: -14deg;
}

.border_l {
  left: 0;
  transform: translateX(-110px);
}
.border_l::before,
.border_l::after {
  content: "";
  position: absolute;
  width: 100%;
  background: var(--gradient);
}

.border_l::before {
  height: var(--border-ratio);
  top: 0;
  transform: skew(var(--border-angle-top));
}

.border_l::after {
  height: calc(100% - var(--border-ratio));
  bottom: 0;
  transform: skew(var(--border-angle-bot));
}

.border_r {
  right: 0;
}
.border_r::before,
.border_r::after {
  content: "";
  position: absolute;
  background: var(--gradient);
  width: 100%;
}

.border_r::before {
  height: var(--border-ratio);
  top: 0;
  transform: skew(calc(-1 * var(--border-angle-top))) rotate(0.5turn);
}

.border_r::after {
  height: calc(100% - var(--border-ratio));
  bottom: 0;
  transform: skew(calc(-1 * var(--border-angle-bot))) rotate(0.5turn);
}

// @media (min-height: 900px) {
//   .home {
//     grid-template-rows: 1vh 1fr 1vh;
//     grid-template-columns: 1fr minmax(40vw, 50rem) 1fr;
//   }
//   .arcade {
//     grid-row-start: 2;
//     grid-column-start: 2;
//   }
// }

@media (max-width: 640px) {
  .home {
    grid-template-columns: 0 1fr 0;
  }
  .arcade_border {
    display: none;
  }

  .arcade::before,
  .arcade::after {
    display: none;
  }

  .line {
    display: none;
  }
}
</style>
