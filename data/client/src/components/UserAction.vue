<template>
  <div class="user-action w-[8rem] h-[5srem] bd-redd">
    <div
      @click="router.push(`/profile/${props.uuid}`)"
      class="avatar w-[5rem] h-[5rem] mx-auto rounded-full overflow-hidden cursor-pointer"
    >
      <img :src="user?.avatar" alt="user image" />
    </div>
    <div class="user-info text-xl font-medium">
      <p class="username truncate bd-redd">
        <span
          class="status relative bottom-[0.05em]"
          :class="{
            'bg-green-online': user?.status === Status.Online,
            'bg-red-my': user?.status === Status.Offline,
            'bg-blue-my': user?.status === Status.InGame,
            circle: user?.status,
          }"
        ></span
        >{{ user?.pseudo }}
      </p>
    </div>
    <div class="actions bd-redd flex justify-center gap-[0.5rem] mt-1">
      <button
        class="accept-btn text-green-dark hover:bg-green-dark hover:text-white hover:border-white"
        @click="acceptFriendRequest(uuid)"
        v-if="mode === Mode.REQUEST_IN"
      >
        accept
      </button>

      <button
        class="decline-btn text-red-my hover:bg-red-my hover:text-white hover:border-white"
        @click="declineFriendRequest(uuid)"
        v-if="mode === Mode.REQUEST_IN"
      >
        decline
      </button>

      <button
        class="unsend-btn text-red-my hover:bg-red-my hover:text-white hover:border-white"
        @click="cancelFriendRequest(uuid)"
        v-if="mode === Mode.REQUEST_OUT"
      >
        unsend
      </button>

      <button
        class="unblock-btn text-red-my hover:bg-red-my hover:text-white hover:border-white"
        @click="unblockUser(uuid)"
        v-if="mode === Mode.BLOCKED"
      >
        unblock
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { Icon } from "@vicons/utils";
// import { UserCircle } from "@vicons/tabler";
import { useUsersStore } from "@/stores/users";
import { useFriendStore } from "@/stores/friend";
import { computed } from "vue";
import { defineProps } from "vue";
import router from "@/router";

import { Status } from "@/types";

const usersStore = useUsersStore();

const {
  acceptFriendRequest,
  declineFriendRequest,
  unblockUser,
  cancelFriendRequest,
} = useFriendStore();
const { users } = usersStore;

const Mode = {
  FRIEND: "friend",
  // REQUESTS: "requests",
  BLOCKED: "blocked",
  REQUEST_IN: "request_in",
  REQUEST_OUT: "request_out",
};

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
});

// console.log(Object.values(Status));
const user = computed(() => {
  return users.get(props.uuid);
});

console.log(user.value);

(() => {
  // check if Mode is valid
  if (!Object.values(Mode).includes(props.mode)) {
    throw new Error("Invalid mode: " + props.mode + "\n");
  }
})();

const myAlert = (msg: string) => {
  alert(msg);
};
</script>

<style lang="scss" scoped>
.actions button {
  border-radius: 0.5rem;
  padding-inline: 0.4rem;
  padding-block: 0.1rem;
  // margin: auto;
}

.accept-btn,
.decline-btn,
.unsend-btn,
.unblock-btn {
  border: 1px solid black;
}

.circle {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  border: 1px solid black;
  display: inline-block;
  margin-right: 0.5rem;
}
</style>
