<template>
  <div
    class="settings-members w-[10rem] flex flex-col gap-[0.5rem] justify-center items-center"
    v-if="!isUnbanned"
  >
    <div class="w-[5rem] h-[5rem] rounded-full overflow-hidden">
      <img
        src="@/assets/svg/profile.svg"
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
      >
        {{ isAdminR ? "Remove admin" : "Set admin" }}
      </button>
      <div class="flex gap-[0.5rem] text-red-my" v-if="!isAdminR">
        <button class="kick">Kick</button>
        <button class="ban">Ban</button>
      </div>
    </div>
    <div class="buttons-banned" v-if="mode === 'bans'">
      <button class="unban" @click="unbanUser">Unban</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRef, ref } from "vue";
import { useChannelsStore } from "@/stores/channels";

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
});

const channelsStore = useChannelsStore();
const isAdminR = toRef(props, "isAdmin");
const isUnbanned = ref(false);

const unbanUser = () => {
  isUnbanned.value = true;
  channelsStore.unbanUser(props.chanId, props.userId);
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
  border: 1px solid black;
}

button:hover {
  background-color: $yellow-hover;
}
</style>
