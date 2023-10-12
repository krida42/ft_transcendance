<template>
  <div class="pong-screen flex flex-col justify-center gap-[0.5rem]">
    <p class="leading-tight">Choose a friend to invite</p>
    <div class="friend-caroussel h-[50%] text-[1.6rem] flex justify-center">
      <img
        @click="decrementPageId"
        class="w-[3rem] rotate-180 cursor-pointer"
        src="@/assets/svg/right-arrow.svg"
      />
      <div class="friend-list w-[75%] normal-case">
        <ul class="self-center">
          <li
            class="py-[0.3rem] pr-[1rem]"
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
            class="py-[0.3rem]"
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
    <SearchUser mode="inviteFriendToPlay" />
  </div>
</template>

<script lang="ts" setup>
import { useFriendStore } from "@/stores/friend";
import SearchUser from "@/components/SearchUser.vue";
import { FriendsTransformer } from "@/utils/friendsTransformer";
import { computed, ref } from "vue";
const friendStore = useFriendStore();
const currentPageId = ref(0);

(() => {
  friendStore.refreshFriendList();
})();

const friendsNestedArray = computed(() => {
  return FriendsTransformer.divideFriendsByN(
    FriendsTransformer.toArray(friendStore.friends),
    3
  );
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
</script>

<style lang="scss" scoped>
.friend-list {
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  grid-template-rows: 1fr;
}
</style>
