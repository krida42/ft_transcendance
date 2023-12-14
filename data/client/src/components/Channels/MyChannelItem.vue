<template>
  <div
    v-if="isJoined === false"
    class="channel-item relative text-[1.2rem] pt-[1rem] pb-[1rem]"
    :class="channel.mode === 'my_channels' ? 'my_channels' : 'explore_channels'"
  >
    <div class="w-[2.4rem] aspect-square rounded-full overflow-hidden">
      <img
        :src="channel.logo ? channel.logo : unknownLogo"
        class="object-cover w-[2.4rem] aspect-square"
      />
    </div>
    <img
      v-if="channel.mode === 'my_channels'"
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
      :class="
        channel.mode === 'my_channels'
          ? channel.is_owner
            ? 'owner-style'
            : 'classic-style'
          : 'owner-style'
      "
      @click.stop="optionsChannel(channel.id)"
    >
      {{ button_text }}
    </button>
  </div>
  <ErrorPopup
    v-if="isErr"
    :statusCode="error.statusCode"
    :message="error.message"
    @close="isErr = false"
  />
</template>

<script lang="ts" setup>
import { defineProps, computed, ref } from "vue";
import router from "@/router";
import { useChannelsStore } from "@/stores/channels";
import unknownLogo from "@/assets/svg/unknown-img.svg";
import ErrorPopup from "@/components/ErrorPopup.vue";
import { ErrorPop } from "@/types";
import axios, { AxiosError } from "axios";
const channel = defineProps({
  id: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: String,
  is_owner: {
    type: Boolean,
    required: false,
  },
  nb_users: {
    type: Number,
    required: true,
  },
});

const channelsStore = useChannelsStore();
const isJoined = ref(false);
const button_text = computed(() => {
  return channel.mode === "my_channels"
    ? channel.is_owner
      ? "settings"
      : "leave"
    : "join";
});
const isErr = ref(false);
const error = ref<ErrorPop>({ statusCode: 0, message: "" });

const optionsChannel = async (channelId: string) => {
  if (channel.mode === "my_channels") {
    if (channel.is_owner) {
      await router.push(`/channels/${channelId}/settings/general`);
    } else {
      await channelsStore.leaveChannel(channelId);
    }
  } else {
    channelsStore
      .joinChannel(channelId)
      .then(() => {
        isJoined.value = true;
      })
      .catch((err: AxiosError | Error) => {
        isErr.value = true;
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.message) {
            if (Array.isArray(err.response.data.message))
              error.value.message = err.response.data.message[0];
            else error.value.message = err.response.data.message;
          }
          if (err.response && err.response.status)
            error.value.statusCode = err.response.status;
        } else {
          error.value.message = err.message;
        }
      });
  }
};
</script>

<style lang="scss" scoped>
.channel-item {
  font-family: "Baumans", cursive;
}

.channel-item::after {
  content: "";
  bottom: 0;
  position: absolute;
  width: 90%;
  height: 1px;
  border-bottom: 1px solid black;
}

.my_channels {
  display: grid;
  grid-template-columns: 1fr 0.5fr 2fr 1fr 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
}

.explore_channels {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
}
.explorer-style {
  background-color: $green-bg;
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
