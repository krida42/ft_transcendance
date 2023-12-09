<template>
  <div class="user-action w-[10rem] h-[5srem] bd-redd">
    <div class="avatar w-[5rem] h-[5rem] mx-auto rounded-full overflow-hidden">
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
            circle: user?.status && mode !== Mode.CHANNEL,
          }"
        ></span
        >{{ user?.pseudo }}
      </p>
    </div>
    <div class="actions bd-redd flex justify-around mt-1">
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
        class="play-btn bg-yellow-hover hover:bg-yellow-700 hover:text-white"
        @click="myAlert('Comming soon...')"
        v-if="mode === Mode.FRIEND"
      >
        play
      </button>

      <button
        class="unblock-btn text-red-my hover:bg-red-my hover:text-white hover:border-white"
        @click="unblockUser(uuid)"
        v-if="mode === Mode.BLOCKED"
      >
        unblock
      </button>
      <button class="invite-btn text-red-my" v-if="mode === Mode.CHANNEL">
        invite
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
  CHANNEL: "channel",
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

.invite-btn {
  color: black;
  background-color: $green-bg;
}

.invite-btn:hover {
  background-color: $yellow-hover;
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
