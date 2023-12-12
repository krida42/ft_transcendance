<template>
  <div class="pong-screen flex flex-col justify-center gap-[0.5rem]">
    <p class="leading-tight">Choose a friend to invite</p>
    <div class="friend-caroussel h-[50%] text-[1.5rem] flex justify-center">
      <img
        @click="decrementPageId"
        class="w-[3rem] rotate-180 cursor-pointer"
        src="@/assets/svg/right-arrow.svg"
      />
      <div class="friend-list w-[75%] normal-case">
        <ul class="self-center">
          <li
            @click="inviteFriend(friend.id)"
            class="py-[0.3rem] text-left cursor-pointer"
            v-for="friend in friendsNestedArray[currentPageId]"
            :key="friend.id"
          >
            {{ friend.pseudo }}
          </li>
        </ul>
        <hr
          class="self-center h-[70%] border-l-2 border-dotted border-[#ffffff]"
        />
        <ul class="self-center pl-[1rem]">
          <li
            @click="inviteFriend(friend.id)"
            class="py-[0.3rem] text-left cursor-pointer"
            v-for="friend in friendsNestedArray[currentPageId + 1]"
            :key="friend.id"
          >
            {{ friend.pseudo }}
          </li>
        </ul>
      </div>
      <img
        @click="incrementPageId"
        class="w-[3rem] cursor-pointer"
        src="@/assets/svg/right-arrow.svg"
      />
    </div>
    <input
      v-model="username"
      placeholder="search a friend..."
      type="text"
      minlength="3"
      maxlength="15"
      class="bg-black text-[1.5rem] border-2 border-[#828287] mx-[8rem] pl-[1rem]"
      @keydown="resetPageId"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFriendStore } from "@/stores/friend";
import { FriendsTransformer } from "@/utils/friendsTransformer";
import { computed, ref } from "vue";
const friendStore = useFriendStore();
const currentPageId = ref(0);
const username = ref("");

(() => {
  friendStore.refreshFriendList();
})();

const listFilteredBySearch = computed(() => {
  return FriendsTransformer.beginWithLetters(
    FriendsTransformer.toArray(friendStore.friends),
    username.value
  );
});

const friendsNestedArray = computed(() => {
  return FriendsTransformer.divideFriendsByN(listFilteredBySearch.value, 3);
});

function incrementPageId() {
  if (currentPageId.value < friendsNestedArray.value.length - 2) {
    currentPageId.value++;
  }
}

function decrementPageId() {
  if (currentPageId.value > 0) {
    currentPageId.value--;
  }
}

function resetPageId() {
  currentPageId.value = 0;
}

function inviteFriend(friendId: string) {
  console.log("Inviting friend", friendId);
}
</script>

<style lang="scss" scoped>
.friend-list {
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  grid-template-rows: 1fr;
}

li::before {
  content: "•";
  color: white;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

li {
  position: relative;
  padding-left: 2rem;
}

li:hover:after {
  content: "";
  position: absolute;
  left: 16%;
  bottom: 0;
  width: 70%;
  border-bottom: 2px solid white;
}
</style>
