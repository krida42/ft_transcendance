<template>
  <div class="user-action w-[10rem] bd-redd">
    <div class="avatar bd-redd mx-auto w-[60%]">
      <img :src="user?.avatar" alt="user image" class="rounded-full" />
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
    <div class="actions bd-redd flex justify-around mt-1">
      <button class="accept-btn text-green-dark" v-if="mode === Mode.REQUESTS">
        accept
      </button>
      <button class="decline-btn text-red-my" v-if="mode === Mode.REQUESTS">
        decline
      </button>
      <button class="play-btn bg-yellow-hover" v-if="mode === Mode.FRIENDS">
        play
      </button>
      <button class="unblock-btn text-red-my" v-if="mode === Mode.BLOCKED">
        unblock
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { Icon } from "@vicons/utils";
// import { UserCircle } from "@vicons/tabler";
import { useUsersStore } from "@/stores/users";
import { computed } from "vue";
import { defineProps } from "vue";

import { Status } from "@/mtypes";

const usersStore = useUsersStore();
const { users } = usersStore;

const Mode = {
  FRIENDS: "friends",
  REQUESTS: "requests",
  BLOCKED: "blocked",
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

console.log(Object.values(Status));
const user = computed(() => {
  return users.get(props.uuid);
});

// check if Mode is valid
if (!Object.values(Mode).includes(props.mode)) {
  throw new Error("Invalid mode");
}
</script>

<style lang="scss" scoped>
.user-action {
}

.actions button {
  border-radius: 0.5rem;
  padding-inline: 0.4rem;
  padding-block: 0.1rem;
  // margin: auto;
}

.accept-btn,
.decline-btn,
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
