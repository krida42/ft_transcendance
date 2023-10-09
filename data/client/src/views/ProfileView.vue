<template>
  <div class="profile">
    <MenuButton
      svgName="pong-logo.svg"
      @click="() => $router.push('/main/home')"
      class="w-[100px]"
    />
    <div class="level">
      <p class="flex gap-[1.8rem] items-center">
        <span class="text-[2rem]">level</span>
        <span class="text-[3.5rem]">{{ level }}</span>
      </p>
    </div>
    <div class="winrate">
      <WinrateChart
        :winrate="winrate"
        :class="displayWinrate ? 'visible' : 'invisible'"
      />
    </div>
    <div class="match-history">
      <h2 class="match-history-title">Match history</h2>
      <ul class="match-history-list">
        <MatchHistoryItem
          v-for="item in matchHistory"
          :key="item.id"
          :nameOp="item.nameOp"
          :scoreMe="item.scoreMe"
          :scoreOp="item.scoreOp"
          :duration="item.duration"
          :date="item.date"
        />
      </ul>
    </div>
    <div class="rank">{{ rank }}</div>
    <div class="achievements">achievements</div>
    <div class="name">
      <img
        :src="avatar"
        class="w-[150px] aspect-square rounded-full break-normal"
      />
      <p class="text-[2.2rem]">{{ username }}</p>
    </div>
    <div class="buttons">
      <button>Parameters</button><button>Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import WinrateChart from "@/components/profile/WinrateChart.vue";
import MatchHistoryItem from "@/components/profile/MatchHistoryItem.vue";
import MenuButton from "@/components/MenuButton.vue";
import axios from "axios";
import { onBeforeMount, ref } from "vue";
import { Match, Id } from "@/types";
const rank = "beginner";
const level = 14;
const winrate = ref<number>(0);
const displayWinrate = ref<boolean>(false);
const matchHistory = ref<Match[]>([]);
const username = ref<string>("");
const avatar = ref<string>("");

async function getWinrate(userId: Id) {
  axios
    .get(
      "http://127.0.0.1:3658/m1/391362-0-default/users/" + userId + "/winrate"
    )
    .then((res) => {
      winrate.value = res.data.winrate;
      displayWinrate.value = true;
    })
    .catch((err) => console.log(err));
}

async function getMatchHistory() {
  axios
    .get("http://127.0.0.1:3658/m1/391362-0-default/users/1/match-history")
    .then((res) => {
      matchHistory.value = res.data;
    })
    .catch((err) => console.log(err));
}

async function getUserInfo() {
  axios
    .get("http://127.0.0.1:3658/m1/391362-0-default/users/1a")
    .then((res) => {
      username.value = res.data.pseudo;
      avatar.value = res.data.avatar;
    })
    .catch((err) => console.log(err));
}

onBeforeMount(() => {
  getWinrate();
  getMatchHistory();
  getUserInfo();
});
</script>

<style lang="scss" scoped>
body,
html {
  background-color: $green-dark;
}

.profile {
  --bento-gap: 3vh;

  min-height: 700px;
  height: 100vh;
  padding: var(--bento-gap);
  background-color: $green-dark;
  font-family: "Baumans", cursive;
  text-transform: uppercase;
  color: black;

  display: grid;
  grid-gap: var(--bento-gap);
  grid-template-columns: 1fr 2fr minmax(250px, 2fr) 4fr;
  grid-template-rows: 1fr 1fr 3fr 2fr;
  grid-template-areas:
    "menu-button  level        winrate match-history"
    "rank         rank         winrate match-history"
    "achievements achievements name    match-history"
    "achievements achievements buttons match-history";
}

.profile > * {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
}

.profile > *:not(:first-child) {
  box-shadow: 1px 5px 4px -3px rgba(0, 0, 0, 0.5);
}

.menu-button {
  grid-area: menu-button;
}

.level {
  grid-area: level;
  background-color: $green-medium;
}

.winrate {
  grid-area: winrate;
  background-color: $green-light;
}

.match-history {
  grid-area: match-history;
  background-color: $green-my;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
}

.match-history-title {
  background-color: $green-light;
  width: calc(100% - 2 * var(--bento-gap));
  padding: 1rem;
  margin: 3vh 3vh 0 3vh;
  border-radius: 20px;
  font-size: 1.8rem;
  box-shadow: 1px 5px 4px -3px rgba(0, 0, 0, 0.5);
}

.match-history-list {
  background-color: $green-bg;
  width: calc(100% - 2 * var(--bento-gap));
  height: 100%;
  margin-bottom: 3vh;
  border-radius: 20px;
  overflow: scroll;
}

.rank {
  grid-area: rank;
  background-color: $green-bg;
  font-size: 2.2rem;
}

.achievements {
  grid-area: achievements;
  background-color: $green-light;
}

.name {
  grid-area: name;
  background-color: black;
  font-family: "VT323";
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.buttons {
  grid-area: buttons;
  background-color: $green-my;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--bento-gap);
}

.buttons > * {
  width: calc(100% - 2 * var(--bento-gap));
  height: calc(50% - 1.5 * var(--bento-gap));
  font-size: 1.5rem;
  text-transform: uppercase;
  background-color: $yellow-hover;
  border-radius: 20px;
  box-shadow: 1px 5px 4px -3px rgba(0, 0, 0, 0.5);
}

.buttons > *:hover {
  box-shadow: inset 3px 5px 4px -3px rgba(0, 0, 0, 0.5);
}

@media (max-width: 1050px) {
  .profile {
    min-height: 550px;
    height: 200vh;
    grid-template-columns: 1fr 2fr minmax(250px, 2fr);
    grid-template-rows:
      minmax(100px, 13vh) minmax(100px, 13vh) minmax(250px, 29vh)
      minmax(100px, 30vh) minmax(500px, 100vh);
    grid-template-areas:
      "menu-button   level          winrate"
      "rank          rank           winrate"
      "achievements  achievements   name"
      "achievements  achievements   buttons"
      "match-history match-history  match-history";
  }
}

@media (max-width: 680px) {
  .profile {
    height: 300vh;
    grid-template-columns: 1fr 2fr;
    grid-template-rows:
      minmax(150px, 21vh) minmax(300px, 46vh) minmax(150px, 21vh)
      minmax(180px, 23vh) minmax(400px, 50vh) minmax(150px, 15vh) minmax(600px, 100vh);
    grid-template-areas:
      "menu-button  level"
      "name         name"
      "rank         rank"
      "winrate      winrate"
      "achievements achievements"
      "buttons      buttons"
      "match-history match-history";
  }
  .buttons {
    flex-direction: row;
  }

  .buttons > * {
    width: calc(50% - 1.5 * var(--bento-gap));
    height: calc(100% - 2 * var(--bento-gap));
  }
}
</style>
