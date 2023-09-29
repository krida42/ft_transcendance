<template>
  <div class="profile">
    <MenuButton
      svgName="pong-logo.svg"
      @click="() => $router.push('/main/home')"
      class="w-[100px]"
    />
    <div class="level">
      <p>
        level <span>{{ level }}</span>
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
      <!-- <ul>
        <li v-for="item in matchHistory" :key="item.id">
          ID: {{ item.id }} | {{ item.scoreMe }}
        </li>
      </ul> -->
    </div>
    <div class="rank">{{ rank }}</div>
    <div class="achievements">achievements</div>
    <div class="name">name</div>
    <div class="buttons">
      <button>Parameters</button><button>Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import WinrateChart from "@/components/profile/WinrateChart.vue";
import MatchHistory from "@/components/profile/MatchHistory.vue";
import MatchHistoryItem from "@/components/profile/MatchHistoryItem.vue";
import MenuButton from "@/components/MenuButton.vue";
import axios from "axios";
import { onBeforeMount, ref } from "vue";
import { Match } from "@/types";
const rank = "beginner";
const level = 14;
const winrate = ref<number>(0);
const displayWinrate = ref<boolean>(false);
const matchHistory = ref<Match[]>([]);
async function getWinrate() {
  axios
    .get(
      "https://977e7a59-9583-467f-acb7-89bdfca620fe.mock.pstmn.io/users/1/winrate"
    )
    .then((res) => {
      winrate.value = res.data.winrate;
      displayWinrate.value = true;
    })
    .catch((err) => console.log(err));
}

async function getMatchHistory() {
  axios
    .get(
      "https://977e7a59-9583-467f-acb7-89bdfca620fe.mock.pstmn.io/users/1/match-history"
    )
    .then((res) => {
      matchHistory.value = res.data.matchHistory;
      console.log(matchHistory.value);
    })
    .catch((err) => console.log(err));
}

onBeforeMount(() => {
  getWinrate();
  getMatchHistory();
});
</script>

<style lang="scss" scoped>
body,
html {
  background-color: $green-dark;
}

.profile {
  --bento-gap: 3vh;

  min-height: 550px;
  height: 100vh;
  padding: var(--bento-gap);
  background-color: $green-dark;
  font-family: "Baumans", cursive;
  text-transform: uppercase;
  color: black;

  display: grid;
  grid-gap: var(--bento-gap);
  grid-template-columns: 1fr 2fr 2fr 3fr;
  grid-template-rows: 1fr 1fr 2fr 2fr;
  grid-template-areas:
    "menu-button  level        winrate match-history"
    "rank         rank         winrate match-history"
    "achievements achievements name    match-history"
    "achievements achievements buttons match-history";
}

@media (max-width: 850px) {
  .profile {
    min-height: 550px;
    height: 200vh;
    grid-template-columns: 1fr 2fr 2fr;
    grid-template-rows:
      minmax(100px, 13vh) minmax(100px, 13vh) minmax(100px, 29vh)
      minmax(100px, 30vh) minmax(500px, 100vh);
    grid-template-areas:
      "menu-button   level          winrate"
      "rank          rank           winrate"
      "achievements  achievements   name"
      "achievements  achievements   buttons"
      "match-history match-history  match-history";
  }
}

@media (max-width: 600px) {
  .profile {
    height: 300vh;
    grid-template-columns: 1fr 2fr;
    grid-template-rows:
      minmax(150px, 21vh) minmax(300px, 46vh) minmax(150px, 21vh)
      minmax(180px, 23vh) minmax(400px, 50vh) minmax(150px, 15vh) minmax(500px, 100vh);
    grid-template-areas:
      "menu-button  level"
      "name         name"
      "rank         rank"
      "winrate      winrate"
      "achievements achievements"
      "buttons      buttons"
      "match-history match-history";
  }
}

.profile > * {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
}

.menu-button {
  grid-area: menu-button;
}

.level {
  grid-area: level;
  background-color: $green-bg;
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
  background-color: $yellow-hover;
  width: calc(100% - 6vh);
  padding: 1rem;
  margin: 3vh 3vh 0 3vh;
  border-radius: 20px;
  font-size: 1.5rem;
}

.match-history-list {
  background-color: $green-bg;
  width: calc(100% - 6vh);
  height: 100%;
  margin-bottom: 3vh;
  border-radius: 20px;
}

.rank {
  grid-area: rank;
  background-color: $yellow-hover;
  font-size: 2.8rem;
}

.achievements {
  grid-area: achievements;
  background-color: $green-light;
}

.name {
  grid-area: name;
  background-color: black;
}

.buttons {
  grid-area: buttons;
  background-color: $green-my;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.buttons > * {
  font-size: 1.5rem;
  text-transform: uppercase;
  background-color: $green-bg;
}
</style>
