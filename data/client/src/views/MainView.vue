<template>
  <div class="home">
    <div class="left flex flex-col items-start justify-between">
      <MenuButton
        svgName="pong-logo.svg"
        @click="() => $router.push('/main/home')"
      />
      <MenuButton
        svgName="heart-menu.svg"
        @click="() => $router.push('/friends')"
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
        <ArcadeButton
          :angle="-90"
          @pongClick="() => router.push('/main/join-queue')"
          >Play random game</ArcadeButton
        >
      </div>
    </div>
    <div class="right flex flex-col items-end justify-between">
      <MenuButton
        svgName="profile.svg"
        @click="() => $router.push('/profile')"
        class="bd-redd"
      />
      <img
        @click="() => $router.push('/channels/my-channels')"
        src="../assets/svg/create.svg"
        class="absolute bottom-[100px] right-[20px] w-[1.5rem] aspect-square"
      />
      <!-- <router-link to="/about"> -->
      <div class="bd-resd mb-[30px] mr-[30px]">
        <div class="bd-redd relative" v-show="chatAccessOpened">
          <ChatAccessList class="relative z-10 right-[2rem]" />

          <ChatMsgList
            class="left-[-420px] top-[-230px]"
            v-show="chatStore.openedChatId !== ''"
          />
        </div>
        <MenuButton
          svgName="message.svg"
          size="90px"
          class="bd-greedn float-right relative z-[100]"
          @click="toggleChatAccess()"
        />
      </div>
      <!-- </router-link> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFriendStore } from "@/stores/friend";
import ArcadeButton from "@/components/ArcadeButton.vue";
import MenuButton from "@/components/MenuButton.vue";
import router from "@/router/index";
import ChatAccessList from "@/components/Chat/ChatAccessList.vue";
import ChatMsgList from "@/components/Chat/ChatMsgList.vue";
import { ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useUsersStore } from "@/stores/users";
import { useMainStore } from "@/stores/main";

const friendStore = useFriendStore();
const usersStore = useUsersStore();
const mainStore = useMainStore();

async function checkFriends() {
  await friendStore.refreshFriendList();
  console.log("la", friendStore.friendsMap.size);
  if (friendStore.friends.size === 0) {
    router.push("/main/friendless");
  } else {
    router.push("/main/friend-play");
  }
}

const chatStore = useChatStore();

friendStore.refreshFriendList();
// usersStore.refreshUser("marine");
// usersStore.refreshUser("someone");
mainStore.refreshUserInfo();

let chatAccessOpened = ref(false);

function toggleChatAccess() {
  chatAccessOpened.value = !chatAccessOpened.value;
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
  min-height: 50rem;
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

.right img:hover {
  cursor: pointer;
  border-radius: 15px;
  background-color: $yellow-hover;
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

@media (max-width: 1000px) {
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
