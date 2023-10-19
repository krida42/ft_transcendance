<template>
  <div class="friends-view">
    <div class="navigation-ctn bg-green-dark">
      <div class="navigation bg-red-200s">
        <div class="pong-button bg-blue-600d">
          <MenuButton svg-name="pong-logo.svg" class="bg-red-500d" />
        </div>
        <div class="status-filters-ctn bg-red-800d">
          <div
            class="friends-btn filter-btn"
            @click="activeListName = ActiveListNames.FRIENDS"
          >
            <Icon size="3em" color="black" class="bg-red-200s">
              <Heart />
            </Icon>
            <p class="bg-blue-100d">Friends</p>
          </div>
          <div class="sub-filters bd-redd">
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
              <span class="circle bg-green-300"></span>
              <span>Online</span>
            </div>
            <div
              class="filter-in-game"
              @click="
                statusFilter = StatusFilter.InGame;
                activeListName = ActiveListNames.FRIENDS;
              "
            >
              <span class="circle bg-yellow-500"></span>
              <span>In game</span>
            </div>
            <div
              class="filter-offline"
              @click="
                statusFilter = StatusFilter.Offline;
                activeListName = ActiveListNames.FRIENDS;
              "
            >
              <span class="circle bg-red-500"></span>
              <span>Offline</span>
            </div>
          </div>
        </div>
        <div
          class="requests-btn filter-btn"
          @click="activeListName = ActiveListNames.REQUESTS"
        >
          <Icon size="3em" color="black" class="bg-red-200s">
            <Heart />
          </Icon>
          <p class="bg-blue-100d">Requests</p>
        </div>
        <div
          class="blocked-btn filter-btn"
          @click="activeListName = ActiveListNames.BLOCKED"
        >
          <Icon size="3em" color="black" class="bg-red-200s">
            <Heart />
          </Icon>
          <p class="bg-blue-100d">Blocked</p>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="friend-input">
        <input type="text" placeholder="add a friend..." />
        <Icon size="1.5em" color="black" class="search-icon bg-red-200d">
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
import { useUsersStore } from "@/stores/users";
import { storeToRefs } from "pinia";
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
  grid-template-columns: minmax(14rem, 1fr) 7fr;
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
    border-radius: 20px;
    width: 90%;
    padding-left: 1rem;
    margin-block: 1rem;
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
    background-color: rgba(#ffffff, 0.5);
    cursor: pointer;
  }
  .sub-filters {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 45%;
    font-size: 1.2em;

    > div {
      cursor: pointer;

      .circle {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        border: 2px solid black;
        display: inline-block;
        margin-right: 0.5rem;
      }
    }
  }
}

.main {
  color: black;
  background-color: $green-bg;
  font-family: "Baumans", cursive;
  // padding-block: 1rem;
  border: 4px solid cyan;
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
