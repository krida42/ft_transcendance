<template>
  <div class="my-channel-item relative text-[1.2rem] pt-[1rem] pb-[1rem]">
    <img
      src="@/assets/svg/unknown-img.svg"
      class="unknown-logo w-[2.4rem] aspect-square"
    />
    <img
      src="@/assets/svg/crown.svg"
      class="crown w-[1.6rem] aspect-square"
      :class="channel.is_owner ? 'visible' : 'invisible'"
    />
    <p>{{ channel?.name }}</p>
    <div class="members flex items-center gap-[0.5rem]">
      <img src="@/assets/svg/profile.svg" class="w-[1.6rem]" />
      <p>{{ channel?.nb_users }}</p>
    </div>
    <button
      class="rounded-[10px] px-[0.5rem] py-[0.4rem]"
      :class="channel.is_owner ? 'owner-style' : 'classic-style'"
      @click="optionsChannel(channel.id)"
    >
      {{ button_text }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { computed } from "vue";
import { useChannelsStore } from "@/stores/channels";
import { useUsersStore } from "@/stores/users";
import router from "@/router";

const channelsStore = useChannelsStore();
const userStore = useUsersStore();

const channel = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: FormData,
  is_owner: {
    type: Boolean,
    required: true,
  },
  nb_users: {
    type: Number,
    required: true,
  },
});

const button_text = computed(() => {
  return channel.is_owner ? "settings" : "leave";
});

const optionsChannel = (channelId: string) => {
  if (channel.is_owner) {
    router.push(`/channels/${channelId}/settings/general`);
  } else {
    console.log("leave");
    //channelsStore.removeUserFromChannel(userStore.currentUser.id, channelId);
    //not working until connected to backend
  }
};
</script>

<style lang="scss" scoped>
.my-channel-item {
  font-family: "Baumans", cursive;
  display: grid;
  grid-template-columns: 1fr 0.5fr 2fr 1fr 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
}

.my-channel-item::after {
  content: "";
  bottom: 0;
  position: absolute;
  width: 90%;
  height: 1px;
  border-bottom: 1px solid black;
}

.owner-style {
  background-color: $yellow-hover;
}

.owner-style:hover {
  background-color: #e0d479;
}

.classic-style {
  background-color: $red-my;
}

.classic-style:hover {
  background-color: #b35b4f;
}
</style>
