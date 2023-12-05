<template>
  <div
    class="my-channels min-h-[100vh] flex flex-col items-center justify-around gap-[3rem]"
  >
    <div class="title w-[25rem] pt-[1rem]">
      <h1 class="text-[1.8rem] pb-[1rem]">My Channels</h1>
      <hr class="border-t-2 border-black" />
    </div>
    <div
      class="channels-ctn min-h-[35rem] h-[80vh] w-[100%] px-[3rem] pb-[3rem]"
    >
      <div
        class="w-[100%] h-[100%] bg-green-light rounded-[15px] overflow-y-scroll"
      >
        <ul class="my-channels-list">
          <MyChannelItem
            v-for="channel in myChannelsList"
            :key="channel.id"
            :id="channel.id"
            :name="channel.name"
            :logo="channel?.logo"
            :members="channel.members"
            :is_owner="channelsStore.isOwner(channel.id, currentUserId)"
            :len="myChannelsList.length"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MyChannelItem from "@/components/Channels/MyChannelItem.vue";
import { ref } from "vue";
import { Channel } from "@/types";
import { useChannelsStore } from "@/stores/channels";
import { useUsersStore } from "@/stores/users";

const channelsStore = useChannelsStore();
const usersStore = useUsersStore();

() => {
  channelsStore.refreshChannels();
};

const currentUserId = usersStore.currentUser?.id;
const myChannelsList = ref<Channel[]>([]);
myChannelsList.value = channelsStore.myChannelsList;
</script>

<style lang="scss" scoped></style>
