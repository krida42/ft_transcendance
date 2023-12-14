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
    <div class="achievements">
      <div
        class="w-[100%] h-[100%] flex flex-wrap content-start gap-[2rem] p-[2rem] overflow-y-auto overflow-x-hidden"
      >
        <AchievementItem
          v-for="achievement in achievements"
          :key="achievement.name"
          :description="achievement.description"
          :name="achievement.name"
          :img="achievement.img"
        />
      </div>
    </div>
    <div class="name">
      <img
        :src="user.avatar"
        class="w-[150px] aspect-square rounded-full break-normal"
      />
      <p class="text-[2.2rem]">{{ user.pseudo }}</p>
    </div>
    <ProfileButttons
      :mode="mode"
      :isFriend="isFriend"
      @button1="button1press"
      @button2="button2press"
    />
    <ProfileSettings
      v-if="isSettings"
      :username="user.pseudo"
      :avatar="user.avatar"
      :twoFactor="twoFactor"
      @closeSettings="() => (isSettings = false)"
    />
  </div>
</template>

<script setup lang="ts">
import WinrateChart from "@/components/profile/WinrateChart.vue";
import MatchHistoryItem from "@/components/profile/MatchHistoryItem.vue";
import MenuButton from "@/components/MenuButton.vue";
import ProfileSettings from "@/components/profile/ProfileSettings.vue";
import ProfileButttons from "@/components/profile/ProfileButtons.vue";
import { onBeforeMount, ref, computed } from "vue";
import { Match, Id } from "@/types";
import { profileModes } from "@/types";
import router from "@/router";
import { useUsersStore } from "@/stores/users";
import { useFriendStore } from "@/stores/friend";
import { User } from "@/types";
import userApi from "@/api/user";
import { Achievement } from "@/types";
import AchievementItem from "@/components/profile/AchievementItem.vue";

const usersStore = useUsersStore();
const friendStore = useFriendStore();
const user = ref<User>(usersStore.currentUser);
const ranks = ["beginner", "intermediate", "advanced", "expert"];
const rank = computed(() => {
  if (winrate.value <= 25) {
    return ranks[0];
  }
  if (winrate.value <= 50) {
    return ranks[1];
  }
  if (winrate.value <= 75) {
    return ranks[2];
  }
  return ranks[3];
});
const level = ref<number>(0);
const winrate = ref<number>(0);
const displayWinrate = ref<boolean>(false);
const matchHistory = ref<Match[]>([]);
const achievements = ref<Achievement[]>([]);
const twoFactor = ref<boolean>(false);
const isSettings = ref<boolean>(false);
const mode = computed(() => {
  if ((router.currentRoute.value.params.userId as string) !== undefined) {
    return profileModes.otherProfile;
  } else {
    return profileModes.myProfile;
  }
});
const isFriend = ref<boolean>(false);

const calcWinrate = () => {
  const wins = matchHistory.value.filter(
    (match) => match.scoreMe >= match.scoreOp
  ).length;
  const losses = matchHistory.value.filter(
    (match) => match.scoreMe < match.scoreOp
  ).length;
  const total = wins + losses;
  if (total === 0) {
    winrate.value = 0;
  } else {
    winrate.value = Math.round((wins / total) * 100);
  }
  level.value = wins;
};

const initUser = async () => {
  if (mode.value === profileModes.otherProfile) {
    const userId = router.currentRoute.value.params.userId as string;
    user.value = await userApi.fetchUser(userId);
    achievements.value = await userApi.getAchievements(userId);
    matchHistory.value = await userApi.getHistory(userId);
    calcWinrate();
    displayWinrate.value = true;
    await friendStore.refreshFriendList();
    isFriend.value = friendStore.friendsMap.get(userId) !== undefined;
    return;
  }
  usersStore.refreshUser(usersStore.currentUser.id);
  user.value = usersStore.currentUser;
  achievements.value = await userApi.getAchievements(usersStore.currentUser.id);
  matchHistory.value = await userApi.getHistory(usersStore.currentUser.id);
  calcWinrate();
  displayWinrate.value = true;
};

onBeforeMount(() => {
  initUser();
});

function button1press() {
  if (mode.value === profileModes.myProfile) {
    isSettings.value = true;
  } else {
    if (isFriend.value) {
      friendStore.deleteFriend(user.value.id);
      router.push("/friends");
      return;
    }
    friendStore.sendFriendRequest(user.value.id);
    router.push("/friends");
  }
}

function button2press() {
  if (mode.value === profileModes.myProfile) {
    console.log("logout");
  } else {
    friendStore.blockUser(user.value.id);
    router.push("/main/home");
  }
}
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
  overflow-y: auto;
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
}
</style>
