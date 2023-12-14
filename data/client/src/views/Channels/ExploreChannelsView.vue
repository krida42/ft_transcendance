<template>
  <div
    class="explore-channels min-h-[100vh] flex flex-col items-center justify-around gap-[2rem]"
  >
    <div class="search-bars w-[100%] flex flex-col justify-start items-center">
      <div
        class="relative bg-yellow-hover rounded-[15px] w-[90%] h-[2.2rem] mt-[2rem]"
      >
        <input
          @keypress.enter="joinChannel"
          v-model="channelName"
          placeholder="enter channel name to join..."
          type="text"
          minlength="3"
          maxlength="20"
          class="w-[100%] h-[100%] rounded-[15px] bg-transparent text-black text-[1.2rem] pl-[1rem]"
        />
        <img
          src="@/assets/svg/search-icon-black.svg"
          class="absolute aspect-square w-[1.5rem] right-[1rem] top-[0.25rem] cursor-pointer"
          @click="sendForm"
        />
      </div>
      <p v-if="isProtected" class="pt-[1rem]">
        This channel is protected, please enter the password
      </p>
      <div
        v-if="isProtected"
        class="relative bg-yellow-hover rounded-[15px] w-[90%] h-[2.2rem] mt-[1rem]"
      >
        <input
          @keypress.enter="joinProtectedChannel"
          v-model="password"
          placeholder="password..."
          type="text"
          class="w-[100%] h-[100%] rounded-[15px] bg-transparent text-black text-[1.2rem] pl-[1rem]"
        />
      </div>
    </div>
    <div class="title w-[25rem]">
      <h1 class="text-[2rem] pb-[1rem]">Most popular channels</h1>
      <hr class="border-t-2 border-black" />
    </div>
    <div
      class="channels-ctn min-h-[25rem] h-[74vh] w-[100%] px-[3rem] pb-[3rem]"
    >
      <div class="w-[100%] h-[100%] bg-green-light rounded-[15px]">
        <ul class="popular-channels-list">
          <MyChannelItem
            v-for="channel in availableChannelsList"
            :key="channel.chanId"
            :id="channel.chanId"
            :mode="'explore'"
            :name="channel.chanName"
            :logo="channel?.imgData"
            :nb_users="channel.nbUser"
          />
          <MyChannelItem
            v-for="channel in invitesList"
            :key="channel.chanId"
            :id="channel.chanId"
            :mode="'explore'"
            :name="channel.chanName"
            :logo="channel?.imgData"
            :nb_users="channel.nbUser"
          />
        </ul>
      </div>
    </div>
  </div>
  <ErrorPopup
    v-if="isErr"
    :statusCode="error.statusCode"
    :message="error.message"
    @close="isErr = false"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MyChannelItem from "@/components/Channels/MyChannelItem.vue";
import { onBeforeMount } from "vue";
import channelsApi from "@/api/channel";
import { Channel } from "@/types";
import { useChannelsStore } from "@/stores/channels";
import ErrorPopup from "@/components/ErrorPopup.vue";
import { ErrorPop } from "@/types";
import axios, { AxiosError } from "axios";
import router from "@/router";

const channelName = ref("");
const password = ref("");
const isProtected = ref(false);
const availableChannelsList = ref<Channel[]>([]);
const protectedChannelsList = ref<Channel[]>([]);
const myChannelsList = ref<Channel[]>([]);
const invitesList = ref<Channel[]>([]);
const channelsStore = useChannelsStore();
const isErr = ref(false);
const error = ref<ErrorPop>({ statusCode: 0, message: "" });
const protectedChannel = ref<Channel>();

const fetchChannels = async () => {
  channelsApi.fetchAvailableChannels().then((res) => {
    availableChannelsList.value = res;
  });
  channelsApi.fetchUnjoinedProtectedChannels().then((res) => {
    protectedChannelsList.value = res;
  });
  channelsApi.fetchMyChannels().then((res) => {
    myChannelsList.value = res;
  });
  channelsApi.fetchInvitedChannels().then((res) => {
    invitesList.value = res;
  });
};

onBeforeMount(() => {
  fetchChannels();
});

const sendForm = () => {
  //console.log(channelName.value);
};

const checkChannelValidity = (): boolean => {
  if (channelName.value.length < 3) {
    isErr.value = true;
    error.value = {
      statusCode: 400,
      message: "Channel name must be at least 3 characters long",
    };
    return false;
  }
  if (channelName.value.length > 20) {
    isErr.value = true;
    error.value = {
      statusCode: 400,
      message: "Channel name must be at most 20 characters long",
    };
    return false;
  }
  if (
    myChannelsList.value.find((chan) => chan.chanName === channelName.value)
  ) {
    isErr.value = true;
    error.value = {
      statusCode: 400,
      message: "You are already in this channel",
    };
    return false;
  }
  return true;
};

const joinChannel = () => {
  isProtected.value = false;
  if (!checkChannelValidity()) return;
  const chanFound = availableChannelsList.value.find(
    (chan) => chan.chanName === channelName.value
  );
  if (chanFound) {
    channelsStore
      .joinChannel(chanFound.chanId)
      .then((chan) => {
        router.push("/channels/my-channels");
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
  } else {
    protectedChannel.value = protectedChannelsList.value.find(
      (chan) => chan.chanName === channelName.value
    );
    if (protectedChannel.value) {
      isProtected.value = true;
    } else {
      isErr.value = true;
      error.value = {
        statusCode: 404,
        message: "Channel not found",
      };
    }
  }
};

const joinProtectedChannel = () => {
  console.log(password.value);
  channelsStore
    .joinProtectedChannel(protectedChannel.value!.chanId, password.value)
    .then((chan) => {
      router.push("/channels/my-channels");
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
};
</script>

<style scoped lang="scss"></style>
