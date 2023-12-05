<template>
  <div
    class="channel-settings-bans min-h-[100vh] flex flex-col items-center justify-around gap-[3rem]"
  >
    <div class="title-ctn w-[16rem] pt-[1rem]">
      <h1 class="text-[1.8rem] pb-[1rem]">Bans</h1>
      <hr class="border-t-2 border-black" />
    </div>
    <div
      class="members-ctn min-h-[35rem] h-[80vh] w-[100%] px-[3rem] pb-[3rem]"
    >
      <div
        class="w-[100%] h-[100%] bg-green-light rounded-[15px] flex flex-wrap overflow-y-scroll"
      >
        <ChannelSettingsMembers
          v-for="member in currentChannel?.members"
          :key="member.id"
          :mode="'bans'"
          :userId="member.id"
          :username="member.pseudo"
          :avatar="member.avatar"
          :isBanned="channelsStore.isBanned(member.id, channelId)"
          :isAdmin="channelsStore.isAdmin(member.id, channelId)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChannelSettingsMembers from "@/components/Channels/ChannelSettingsMembers.vue";
import { useChannelsStore } from "@/stores/channels";
import { computed } from "vue";
import router from "@/router";

const channelsStore = useChannelsStore();

() => {
  channelsStore.refreshChannels();
};

const channelId = router.currentRoute.value.params.id as string;

const currentChannel = computed(() => channelsStore.channel(channelId));
</script>
