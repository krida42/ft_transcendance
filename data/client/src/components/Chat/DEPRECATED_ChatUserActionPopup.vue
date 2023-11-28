<template>
  <div
    class="chat-user-action-popup grid grid-rows-2 w-[18rem] h-[9rem] bg-black bg-opacity-80 rounded-xl text-white px-5 py-3"
  >
    <div class="user-info dbg-green-200 grid grid-cols-12 gap-x-3 items-center">
      <div class="user-avatar col-span-3 border-red-900 border-2d">
        <img
          :src="user?.avatar"
          alt="avatar"
          class="rounded-full w-[92%] mx-auto"
        />
      </div>
      <p
        class="user-name dbd-blue truncate col-span-8 self-center px-3 text-start"
      >
        {{ user?.pseudo }}
      </p>
      <Icon
        size="1.8rem"
        class="bd-blues self-start justify-self-end relative right-[-0.6rem] top-[-0.4rem] cursor-pointer"
        @click="emits('close')"
      >
        <X />
      </Icon>
    </div>
    <div class="actions flex justify-around items-center gap-x-5">
      <!-- prettier-ignore-->
      <Transition name="heartbeat-success">
        <!-- <button v-if="friends.get(user!.id)" class="hover:bg-gray-500">PROFILE</button>
        <button v-else-if="friendsReceived.get(user!.id)" class="hover:bg-gray-500" @click="acceptFriendRequest(user!.id)">ACCEPT FRIEND</button>
        <button v-else-if="friendsSent.get(user!.id)" class="hover:bg-gray-500" @click="cancelFriendRequest(user!.id)">UNSEND</button> -->
        <button v-if="canAddFriend" class="hover:bg-gray-500" @click="sendFriendRequest(user!.id)">ADD FRIEND</button>
      </Transition>
      <button
        class="text-red-my hover:bg-[#7c2c2c] www-[100%]"
        @click="blockUser(user!.id)"
      >
        BLOCK
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { User, X } from "@vicons/tabler";
import { computed, defineEmits, defineProps, ref } from "vue";
import { useUsersStore } from "@/stores/users";
import { useFriendStore } from "@/stores/friend";
import { storeToRefs } from "pinia";

const props = defineProps({
  test: {
    type: Object as () => User,
    required: false,
  },
  uuid: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["close"]);

const usersStore = useUsersStore();
const friendStore = useFriendStore();
const { sendFriendRequest, blockUser } = friendStore;

const user = computed(() => {
  return usersStore.users.get(props.uuid);
});

let canAddFriend = computed(() => {
  if (!user.value) return false;
  return (
    !friendStore.friends.has(user.value.id) &&
    !friendStore.friendsSent.has(user.value.id)
  );
});
</script>

<style lang="scss" scoped>
.chat-user-action-popup {
  font-family: "Baumans";
}

// div.actions button:first-child:hover {
//   background-color: #6b7280; //gray-500
// }

button {
  //   background: #7c2c2c;
  border: 1px solid white;
  border-radius: 0.5rem;
  width: 100%;
  margin-top: 0.4rem;
  //   margin-bottom: 1rem;
  height: 2.3rem;
}
</style>
