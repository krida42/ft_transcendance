<template>
  <div
    class="settings-members flex flex-col gap-[0.5rem] justify-top items-center pb-[1rem]"
    :class="props.mode === 'invite' ? 'w-[7rem]' : 'w-[10rem]'"
    v-if="!isUnbanned && !isMyself && !isBanned && !isInChannel"
  >
    <div class="w-[5rem] h-[5rem] rounded-full overflow-hidden">
      <img
        :src="props.avatar"
        alt="user image"
        class="w-[100%] h-[5rem] object-cover"
      />
    </div>
    <div class="username flex gap-[0.25rem]">
      <img
        src="@/assets/svg/red-shield.svg"
        :class="isAdminR ? 'block' : 'hidden'"
      />
      <p class="text-[1.5rem]">{{ username }}</p>
    </div>
    <div class="buttons-members" v-if="mode === 'members'">
      <button
        class="admin mb-[0.5rem]"
        :class="isAdminR ? 'text-red-my' : 'text-black'"
        @click="adminButton"
      >
        {{ isAdminR ? "Remove admin" : "Set admin" }}
      </button>
      <div class="flex gap-[0.5rem] text-red-my" v-if="!isAdminR">
        <button class="kick" @click="kickUser">Kick</button>
        <button class="ban" @click="banUser">Ban</button>
      </div>
    </div>
    <div class="buttons-banned" v-if="mode === 'bans'">
      <button class="unban" @click="unbanUser">Unban</button>
    </div>
    <div
      :class="isInvited ? 'buttons-invited' : 'buttons-invite'"
      v-if="mode === 'invite'"
    >
      <div
        class="invite"
        @click="
          () => {
            $emit('invite', userId);
            isInvited = !isInvited;
          }
        "
      >
        {{ isInvited ? "Invited" : "Invite" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRef, ref, computed } from "vue";
import { useChannelsStore } from "@/stores/channels";
import { useUsersStore } from "@/stores/users";
import { User } from "@/types";

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  chanId: {
    type: String,
    required: true,
  },
  members: {
    type: Object as () => User[],
    required: false,
  },
  invites: {
    type: Object as () => string[],
    required: false,
  },
});

const channelsStore = useChannelsStore();
const userStore = useUsersStore();
const isAdminR = toRef(props, "isAdmin");
const isBanned = ref(false);
const isUnbanned = ref(false);
const isMyself = ref(false);
const isInvited = ref(
  props.invites ? props.invites.includes(props.userId) : false
);
const isInChannel = computed(() => {
  if (props.members) {
    return props.members.some((member) => member.id === props.userId);
  }
  return false;
});

(() => {
  const myId = userStore.currentUser.id;
  if (props.userId === myId) {
    isMyself.value = true;
  }
})();

const unbanUser = () => {
  isUnbanned.value = true;
  channelsStore.unbanUser(props.chanId, props.userId);
};

const banUser = () => {
  isBanned.value = true;
  channelsStore.banUser(props.chanId, props.userId);
};

const kickUser = () => {
  isBanned.value = true;
  channelsStore.kickUser(props.chanId, props.userId);
};

const adminButton = () => {
  if (isAdminR.value) {
    channelsStore.removeAdmin(props.chanId, props.userId);
  } else {
    channelsStore.addAdmin(props.chanId, props.userId);
  }
  isAdminR.value = !isAdminR.value;
};
</script>

<style lang="scss" scoped>
.settings-members {
  font-family: "Baumans", cursive;
  font-size: 1.2rem;
}

button {
  background-color: $green-bg;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  border-radius: 10px;
}

button:hover {
  background-color: $yellow-hover;
}

.buttons-invite {
  cursor: pointer;
  background-color: $green-bg;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  border-radius: 10px;
}

.buttons-invite:hover {
  background-color: $yellow-hover;
}

.buttons-invited {
  cursor: pointer;
  background-color: $yellow-hover;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  border-radius: 10px;
}
</style>
