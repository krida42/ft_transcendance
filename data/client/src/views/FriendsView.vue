<template>
  <div class="friends-view">
    <!-- <div
      class="burger z-[2]"
      ref="burgerEl"
      @click="burgerIsOpen = !burgerIsOpen"
    >
      <img
        src="../assets/svg/right-arrow.svg"
        alt=""
        srcset=""
        class="border-2s border-red-900"
      />
    </div> -->
    <!-- <Transition name="slide"> -->
    <div
      class="navigation-ctn bg-green-dark"
      :class="{
        'open-nav': burgerIsOpen || !isMobile,
        'nav-shadow': burgerIsOpen && isMobile,
      }"
    >
      <div
        class="burger"
        :class="{
          'open-burger': burgerIsOpen,
        }"
        @click="
          burgerIsOpen = !burgerIsOpen;
          console.log('coucou');
        "
      >
        <img
          src="../assets/svg/right-arrow.svg"
          alt=""
          srcset=""
          class="border-2s border-red-900"
        />
      </div>
      <div class="navigation">
        <div class="pong-button">
          <MenuButton
            svg-name="pong-logo.svg"
            @click="() => $router.push('/main/home')"
          />
        </div>
        <div class="status-filters-ctn">
          <div
            class="friends-btn filter-btn"
            :class="{
              'bg-green-medium': activeListName === ActiveListName.FRIENDS,
            }"
            @click="
              activeListName = ActiveListName.FRIENDS;
              statusFilter = StatusFilter.All;
            "
          >
            <Icon size="3em" color="black">
              <Heart />
            </Icon>
            <p>Friends</p>
          </div>
          <div class="sub-filters">
            <div
              class="filter-all bg-opacity-50"
              :class="{
                'bg-green-medium':
                  statusFilter === StatusFilter.All &&
                  activeListName === ActiveListName.FRIENDS,
              }"
              @click="
                statusFilter = StatusFilter.All;
                activeListName = ActiveListName.FRIENDS;
              "
            >
              <!-- prettier-ignore -->
              <span class="circle bg-black"></span>
              <span class="">All</span>
            </div>
            <div
              class="filter-online bg-opacity-50"
              :class="{
                'bg-green-medium':
                  statusFilter === StatusFilter.Online &&
                  activeListName === ActiveListName.FRIENDS,
              }"
              @click="
                statusFilter = StatusFilter.Online;
                activeListName = ActiveListName.FRIENDS;
              "
            >
              <!-- prettier-ignore -->
              <span class="circle bg-green-online"></span>
              <span>Online</span>
            </div>
            <div
              class="filter-in-game bg-opacity-50"
              :class="{
                'bg-green-medium':
                  statusFilter === StatusFilter.InGame &&
                  activeListName === ActiveListName.FRIENDS,
              }"
              @click="
                statusFilter = StatusFilter.InGame;
                activeListName = ActiveListName.FRIENDS;
              "
            >
              <span class="circle bg-blue-button"></span>
              <span>In game</span>
            </div>
            <div
              class="filter-offline bg-opacity-50"
              :class="{
                'bg-green-medium':
                  statusFilter === StatusFilter.Offline &&
                  activeListName === ActiveListName.FRIENDS,
              }"
              @click="
                statusFilter = StatusFilter.Offline;
                activeListName = ActiveListName.FRIENDS;
              "
            >
              <span class="circle bg-red-my"></span>
              <span>Offline</span>
            </div>
          </div>
        </div>
        <div
          class="requests-btn filter-btn"
          :class="{
            'bg-green-medium': activeListName === ActiveListName.REQUESTS,
          }"
          @click="activeListName = ActiveListName.REQUESTS"
        >
          <img
            src="../assets/svg/friend-request.svg"
            class="w-[2.6rem] aspect-square ml-[-8px]"
          />
          <p class="bg-blue-100d">Requests</p>
        </div>
        <div
          class="blocked-btn filter-btn"
          :class="{
            'bg-green-medium': activeListName === ActiveListName.BLOCKED,
          }"
          @click="activeListName = ActiveListName.BLOCKED"
        >
          <img src="../assets/svg/blocked.svg" class="aspect-square" />
          <p class="bg-blue-100d">Blocked</p>
        </div>
      </div>
    </div>
    <!-- </Transition> -->
    <div class="gradient"></div>
    <div class="main">
      <div
        class="friend-input"
        v-show="activeListName !== ActiveListName.BLOCKED"
      >
        <input
          type="text"
          :placeholder="
            activeListName === ActiveListName.FRIENDS
              ? 'Search a friend..'
              : 'Add a friend'
          "
          v-model="searchedUser"
          @keyup.enter="executeSearchInput"
        />
        <Icon size="1.5em" color="black" class="search-icon">
          <Search />
        </Icon>
      </div>
      <div
        class="users-list"
        @click="burgerIsOpen = isMobile && burgerIsOpen ? false : burgerIsOpen"
      >
        <transition-group name="flip">
          <user-action
            v-for="user in activeListFilteredBySearch"
            :key="user.id"
            :uuid="user.id"
            :mode="
              activeListName === ActiveListName.REQUESTS
                ? getRequestDirMode(user)
                : activeListName
            "
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { Heart, Search, Menu2 } from "@vicons/tabler";
import MenuButton from "@/components/MenuButton.vue";
import UserAction from "@/components/UserAction.vue";
import { FriendsTransformer } from "@/utils//friendsTransformer";
import { useFriendStore } from "@/stores/friend";
import { computed, ref, onMounted, onUnmounted } from "vue";

import { Status } from "@/mtypes";
import { useUsersStore } from "@/stores/users";
import userApi from "@/api/user";

const usersStore = useUsersStore();
const friendStore = useFriendStore();

(() => {
  friendStore.refreshFriendList();
  friendStore.refreshFriendsReceived();
  friendStore.refreshFriendsSent();
  friendStore.refreshBlocked();
})();

enum StatusFilter {
  All = "all",
  Online = "online",
  InGame = "inGame",
  Offline = "offline",
}

let statusFilter = ref(StatusFilter.All);

enum ActiveListName {
  FRIENDS = "friend",
  REQUESTS = "request",
  BLOCKED = "blocked",
  REQUESTS_IN = "request_in",
  REQUESTS_OUT = "request_out",
}

let activeListName = ref(ActiveListName.FRIENDS);
const activeList = computed(() => {
  switch (activeListName.value) {
    case ActiveListName.FRIENDS:
      return [...friendStore.DEBUG_friendsStatusRand.values()].filter((v) => {
        switch (statusFilter.value) {
          case StatusFilter.All:
            return true;
          case StatusFilter.Online:
            return v.status === Status.Online;
          case StatusFilter.InGame:
            return v.status === Status.InGame;
          case StatusFilter.Offline:
            return v.status === Status.Offline;
        }
      });

    case ActiveListName.REQUESTS:
      return [
        ...Array.from(friendStore.friendsReceived.values(), (user: any) => {
          user.requestDirection = "received";
          return user;
        }),
        ...Array.from(friendStore.friendsSent.values(), (user: any) => {
          user.requestDirection = "sent";
          return user;
        }),
      ];
    case ActiveListName.BLOCKED:
      return [...friendStore.blocked.values()];
    default:
      return [...friendStore.friends.values()];
  }
});

function getRequestDirMode(user: any) {
  if (user.requestDirection === "received") {
    return ActiveListName.REQUESTS_IN;
  } else if (user.requestDirection === "sent") {
    return ActiveListName.REQUESTS_OUT;
  } else {
    return "NO REQUEST DIRECTION";
  }
}

let searchedUser = ref("");

const activeListFilteredBySearch = computed(() => {
  return FriendsTransformer.beginWithLetters(
    activeList.value,
    searchedUser.value
  );
});

// setTimeout(() => {
//   console.log(getComputedStyle(burgerEl.value!));
// }, 500);

// watch(
//   () => getComputedStyle(burgerEl.value!),
//   (el) => {
//     console.log("changement de burgerEl", el);
//   }
// );

const MOBILE_WIDTH = 793; //MODIFIER DANS LE SCSS EGALEMENT POUR LES MEDIA QUERIES

let burgerIsOpen = ref(true);

let isMobile = ref(window.innerWidth <= MOBILE_WIDTH);

function eventHandlerWindowResize() {
  console.log(window.innerWidth);
  isMobile.value = window.innerWidth <= MOBILE_WIDTH;
  burgerIsOpen.value = !isMobile.value ? false : burgerIsOpen.value;
}

onMounted(() => {
  window.addEventListener("resize", eventHandlerWindowResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", eventHandlerWindowResize);
});

function executeSearchInput(e: KeyboardEvent) {
  if (activeListName.value === ActiveListName.REQUESTS) {
    userApi.fetchUserByPseudo(searchedUser.value).then((user) => {
      if (user) {
        friendStore.sendFriendRequest(user.id);
      }
    });
    searchedUser.value = "";
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: $green-light;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb {
  background-color: $green-dark;
  border-radius: 9999px;
  // outline: 1px solid slategrey;
}

.friends-view {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(6rem, 0.4fr) 7fr;
  grid-template-rows: 100vh;
  height: 100vh;
  width: 100%;
}

.burger {
  display: none;
}

.navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Baumans", cursive;
  color: black;
  font-size: 0.9em;

  .pong-button {
    align-self: flex-start;
  }

  .status-filters-ctn {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .filter-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.8em;
    border-radius: 15px;
    width: 90%;
    padding-left: 1rem;
    margin-block: 0.8rem;
    font-size: 0.9em;
    &:hover {
      background-color: $green-medium;
      cursor: pointer;
    }

    p {
      padding-top: 0.7rem;
      font-size: 1.8em;
      line-height: normal;
      padding-bottom: 0.5rem;
    }
  }

  .sub-filters {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 50%;
    font-size: 1.2em;

    > div {
      cursor: pointer;
      text-align: start;
      width: 100%;
      padding: 0 0.8rem 0 0.8rem;
      border-radius: 10px;
      &:hover {
        background-color: $green-medium;
      }

      .circle {
        width: 0.7rem;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: 1.5px solid black;
        display: inline-block;
        margin-right: 0.8rem;
      }
    }
  }
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
.main {
  color: black;
  background-color: $green-bg;
  font-family: "Baumans", cursive;
  // padding-block: 1rem;
  padding: 1.4rem;
  display: grid;
  grid-template-rows: auto 1fr;
  div.friend-input {
    // border: 1px red solid;
    background-color: $green-light;
    display: grid;
    grid-template-columns: 1fr auto;
    border-radius: 15px;
    // margin-inline: auto;

    input {
      // border: 1px blue solid;
      padding: 0.5rem;
      padding-left: 0.9rem;
      background-color: transparent;
    }
    input::placeholder {
      color: black;
      opacity: 0.7;
    }
    .search-icon {
      align-self: center;
      margin-inline: 0.5rem;
    }
  }
  .users-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4rem 1.8rem;
    padding-inline: 2.5rem;
    margin-top: 2.5rem;
    // border: 1px red solid;
    overflow-y: auto;
    align-content: flex-start;
  }
}

@media (max-width: 793px) {
  .friends-view {
    grid-template-columns: 1fr;
    grid-template-rows: 100vh;
  }
  // .burger-shadow {
  //   // content: "";
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   background-color: black;
  //   opacity: 0.7;
  //   left: 0;
  //   z-index: 1;
  //   // display: none;
  // }

  .navigation-ctn {
    $nav-width: 15rem;
    position: absolute;
    z-index: 2;
    width: $nav-width;
    height: 100vh;
    font-size: 1.05em;
    left: -$nav-width;
    transition: all 0.6s ease;

    .burger {
      display: initial;
      position: absolute;
      right: -1.2rem;
      // right: -1.6rem;
      top: 49%;
      width: 2.2rem;
      // margin: auto;
      // transform: translateY(-50%);
      background-color: $green-dark;
      border-radius: 9999px;
      padding-block: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      img {
        margin-left: 15%;
      }
    }

    .open-burger {
      transform: rotate(180deg);
      // background-color: transparent;
      img {
        margin-left: 0;
      }
    }
  }

  .nav-shadow {
    box-shadow: 0px 0px 9999px 100vw rgba(0, 0, 0, 0.6),
      0 0 20px 10px rgba(0, 0, 0, 0.4);
  }

  .gradient {
    display: none;
    // position: absolute;
    // left: 15rem;
    // z-index: 1;
    // width: 5%;
    // height: 100vh;
  }
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.open-nav {
  left: 0;
  // border: 5px red solid;
}
// .open-nav-anim {
//   animation: open-nav 1s ease;
// }

// @keyframes open-nav {
//   0% {
//     transform: translateX(-80%);
//   }
//   100% {
//     transform: translateX(0%);
//   }
// }

$cui: 0.28s;

.flip-enter-active {
  animation: flip-in-hor-bottom (0.5s - $cui)
    cubic-bezier(0.25, 0.46, 0.45, 0.94) (0.46s - $cui) both;
}

@keyframes flip-in-hor-bottom {
  0% {
    transform: rotateX(80deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0);
    opacity: 1;
  }
}

.flip-leave-active {
  animation: flip-out-hor-top (0.45s - $cui)
    cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

@keyframes flip-out-hor-top {
  0% {
    transform: rotateX(0);
    opacity: 1;
  }
  100% {
    transform: rotateX(70deg);
    opacity: 0;
  }
}
</style>
