<template>
  <div class="friends-view">
    <div class="navigation-ctn bg-green-dark">
      <div class="navigation bg-red-200s">
        <div class="pong-button bg-blue-600d">
          <MenuButton svg-name="pong-logo.svg" class="bg-red-500d" />
        </div>
        <div class="status-filters-ctn bg-red-800d">
          <div class="filter-btn">
            <Icon size="3em" color="black" class="bg-red-200s">
              <Heart />
            </Icon>
            <p class="bg-blue-100d">Friends</p>
          </div>
          <div class="sub-filters bd-redd">
            <div class="filter-all">
              <!-- prettier-ignore -->
              <span class="circle bg-black"></span>
              <span class="">All</span>
            </div>
            <div class="filter-online">
              <!-- prettier-ignore -->
              <span class="circle bg-green-300"></span>
              <span>Online</span>
            </div>
            <div class="filter-in-game">
              <span class="circle bg-yellow-500"></span>
              <span>In game</span>
            </div>
            <div class="filter-offline">
              <span class="circle bg-red-500"></span>
              <span>Offline</span>
            </div>
          </div>
        </div>
        <div class="requests-btn filter-btn">
          <Icon size="3em" color="black" class="bg-red-200s">
            <Heart />
          </Icon>
          <p class="bg-blue-100d">Requests</p>
        </div>
        <div class="blocked-btn filter-btn">
          <Icon size="3em" color="black" class="bg-red-200s">
            <Heart />
          </Icon>
          <p class="bg-blue-100d">Blocked</p>
        </div>
      </div>
    </div>
    <div class="main bg-green-light">
      <div class="friend-input">
        <input type="text" placeholder="Search for friends" />
      </div>
      <div class="friends-list"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { Heart } from "@vicons/tabler";
import MenuButton from "@/components/MenuButton.vue";
</script>

<style lang="scss" scoped>
.friends-view {
  display: grid;
  grid-template-columns: minmax(14em, 1fr) 7fr;
  height: 100vh;
  width: 100%;
}

.navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Baumans", cursive;
  color: black;

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

    p {
      padding-top: 0.5rem;
      font-size: 1.6em;
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
</style>
