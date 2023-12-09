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
        class="w-[100%] h-[100%] bg-green-light rounded-[15px] flex flex-wrap gap-[1rem] content-start overflow-y-auto pt-[1rem]"
      >
        <ChannelSettingsMembers
          v-for="member in bans"
          :key="member.id"
          :mode="'bans'"
          :userId="member.id"
          :username="member.pseudo"
          :avatar="member.avatar"
          :isAdmin="channelsStore.isAdmin(member.id, channelId)"
          :chanId="channelId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChannelSettingsMembers from "@/components/Channels/ChannelSettingsMembers.vue";
import { useChannelsStore } from "@/stores/channels";
import { onBeforeMount, ref } from "vue";
import router from "@/router";

const channelId = router.currentRoute.value.params.channelId as string;
const channelsStore = useChannelsStore();

let bans = ref(channelsStore.channel(channelId)?.bans);

async function refreshBans() {
  await channelsStore.refreshChannels();
  await channelsStore.refreshBans(channelId);
  bans.value = channelsStore.channel(channelId)?.bans;
}

onBeforeMount(() => {
  refreshBans();
});
</script>
