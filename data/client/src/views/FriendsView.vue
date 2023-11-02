<template>
  <div class="friends-view">
    <div class="navigation-ctn bg-green-dark">
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
            @click="activeListName = ActiveListNames.FRIENDS"
          >
            <Icon size="3em" color="black">
              <Heart />
            </Icon>
            <p>Friends</p>
          </div>
          <div class="sub-filters">
            <div
              class="filter-all"
              @click="
                statusFilter = StatusFilter.All;
                activeListName = ActiveListNames.FRIENDS;
              "
            >
              <!-- prettier-ignore -->
              <span class="circle bg-black"></span>
              <span class="">All</span>
            </div>
            <div
              class="filter-online"
              @click="
                statusFilter = StatusFilter.Online;
                activeListName = ActiveListNames.FRIENDS;
              "
            >
              <!-- prettier-ignore -->
              <span class="circle bg-green-online"></span>
              <span>Online</span>
            </div>
            <div
              class="filter-in-game"
              @click="
                statusFilter = StatusFilter.InGame;
                activeListName = ActiveListNames.FRIENDS;
              "
            >
              <span class="circle bg-blue-button"></span>
              <span>In game</span>
            </div>
            <div
              class="filter-offline"
              @click="
                statusFilter = StatusFilter.Offline;
                activeListName = ActiveListNames.FRIENDS;
              "
            >
              <span class="circle bg-red-my"></span>
              <span>Offline</span>
            </div>
          </div>
        </div>
        <div
          class="requests-btn filter-btn"
          @click="activeListName = ActiveListNames.REQUESTS"
        >
          <img
            src="../assets/svg/friend-request.svg"
            class="w-[2.6rem] aspect-square ml-[-8px]"
          />
          <p class="bg-blue-100d">Requests</p>
        </div>
        <div
          class="blocked-btn filter-btn"
          @click="activeListName = ActiveListNames.BLOCKED"
        >
          <img src="../assets/svg/blocked.svg" class="aspect-square" />
          <p class="bg-blue-100d">Blocked</p>
        </div>
      </div>
    </div>
    <div class="gradient"></div>
    <div class="main">
      <div class="friend-input">
        <input type="text" placeholder="add a friend..." />
        <Icon size="1.5em" color="black" class="search-icon">
          <Search />
        </Icon>
      </div>
      <div class="users-list">
        <user-action
          v-for="[, user] in activeList"
          :key="user.id"
          :uuid="user.id"
          :mode="activeListName"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { Heart, Search } from "@vicons/tabler";
import MenuButton from "@/components/MenuButton.vue";
import UserAction from "@/components/UserAction.vue";
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

enum ActiveListNames {
  FRIENDS = "friends",
  REQUESTS = "requests",
  BLOCKED = "blocked",
}

let activeListName = ref(ActiveListNames.FRIENDS);
const activeList = computed(() => {
  switch (activeListName.value) {
    case ActiveListNames.FRIENDS:
      return new Map(
        [...friendStore.DEBUG_friendsStatusRand].filter(([, v]) => {
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
        })
      );
    case ActiveListNames.REQUESTS:
      return new Map([
        ...friendStore.friendsReceived,
        ...friendStore.friendsSent,
      ]);
    case ActiveListNames.BLOCKED:
      return friendStore.blocked;
    default:
      return friendStore.friends;
  }
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
    justify-content: flex-start;
    gap: 0.8em;
    border-radius: 15px;
    width: 90%;
    padding-left: 1rem;
    margin-block: 0.8rem;
    font-size: 0.9em;

    p {
      padding-top: 0.7rem;
      font-size: 1.8em;
      line-height: normal;
      padding-bottom: 0.5rem;
    }
  }

  .filter-btn:hover {
    //   background-color: rgba($color: #ffffff, $alpha: 0.5);
    background-color: $green-medium;
    cursor: pointer;
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
  .sub-filters > *:hover {
    background-color: $green-medium;
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
  }
}
</style>
