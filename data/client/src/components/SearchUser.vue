<template>
  <div class="form-wrapper flex justify-center mx-auto">
    <form @submit.prevent="sendForm">
      <input
        v-model="username"
        placeholder="username..."
        type="text"
        minlength="3"
        maxlength="15"
        class="bg-black text-[1.5rem] border-2 border-[#828287] ml-[3rem] mr-[1rem] pl-[0.5rem]"
      />
    </form>
    <img
      class="w-[2rem]"
      :class="isSent ? 'w-[2rem]' : 'w-[2.5rem]'"
      :src="
        isSent
          ? isValidUsername
            ? require('@/assets/svg/green-tick.svg')
            : require('@/assets/svg/red-cross.svg')
          : require('@/assets/svg/search-icon.svg')
      "
    />
  </div>
  <p
    :class="[
      isValidUsername ? 'text-green-my' : 'text-red-my',
      $props.mode === 'addFriend' ? 'block' : 'hidden',
    ]"
    class="h-[0.5rem]"
  >
    {{ loginMessage }}
  </p>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { defineProps } from "vue";
import { useFriendStore } from "@/stores/friend";
import { useUsersStore } from "@/stores/users";
import userApi from "@/api/user";

const username = ref("");
const loginMessage = ref("");
const isSent = ref(false);
const isValidUsername = ref(false);
const friendStore = useFriendStore();
const userStore = useUsersStore();

defineProps({
  mode: {
    type: String,
    required: true,
  },
});

const sendFriendRequest = async () => {
  isSent.value = true;
  await friendStore.refreshFriendList();
  await friendStore.refreshFriendsSent();
  const myId = userStore.currentUser.id;
  userApi
    .fetchUserByPseudo(username.value)
    .then((user) => {
      if (user.id === myId) {
        isValidUsername.value = false;
        loginMessage.value = "You can't add yourself";
        return;
      }
      if (friendStore.friendsSent.has(user.id)) {
        isValidUsername.value = false;
        loginMessage.value = "Friend request already sent";
        return;
      }
      friendStore.friends.forEach((friend) => {
        if (friend.id === user.id) {
          isValidUsername.value = false;
          loginMessage.value = "User already in your friend list";
          return;
        }
      });
      isValidUsername.value = true;
      loginMessage.value = "Friend request sent";
      friendStore.sendFriendRequest(user.id);
    })
    .catch((err) => {
      isValidUsername.value = false;
      loginMessage.value = "User not found";
    });
};

const sendForm = sendFriendRequest;
</script>
