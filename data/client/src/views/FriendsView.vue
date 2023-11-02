<template>
  <div class="friends-view">
    <div class="navigation-ctn bg-green-dark">
      <div class="navigation">
        <div class="pong-button">
          <MenuButton svg-name="pong-logo.svg" />
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
    <div class="gradient"></div>
    <div class="main">
      <div class="friend-input">
        <input type="text" placeholder="Search..." v-model="searchedUser" />
        <Icon size="1.5em" color="black" class="search-icon">
          <Search />
        </Icon>
      </div>
      <div class="users-list">
        <transition-group name="flip">
          <user-action
            v-for="user in activeListFilteredBySearch"
            :key="user.id"
            :uuid="user.id"
            :mode="activeListName"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { Heart, Search } from "@vicons/tabler";
import MenuButton from "@/components/MenuButton.vue";
import UserAction from "@/components/UserAction.vue";
import { FriendsTransformer } from "@/utils//friendsTransformer";
import { useFriendStore } from "@/stores/friend";
import { computed, ref } from "vue";

import { Status } from "@/mtypes";

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
  FRIENDS = "friends",
  REQUESTS = "requests",
  BLOCKED = "blocked",
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
        ...friendStore.friendsReceived.values(),
        ...friendStore.friendsSent.values(),
      ];
    case ActiveListName.BLOCKED:
      return [...friendStore.blocked.values()];
    default:
      return [...friendStore.friends.values()];
  }
});

let searchedUser = ref("");

const activeListFilteredBySearch = computed(() => {
  return FriendsTransformer.beginWithLetters(
    activeList.value,
    searchedUser.value
  );
});
</script>

<style lang="scss" scoped>
.friends-view {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(6rem, 0.4fr) 7fr;
  grid-template-rows: 100vh;
  height: 100vh;
  width: 100%;
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
    justify-content: start;
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
    overflow-y: scroll;
    align-content: flex-start;
  }
}

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
