<template>
  <div
    class="channel-settings-members min-h-[100vh] flex flex-col items-center justify-around gap-[3rem]"
  >
    <div class="title-ctn w-[16rem] pt-[1rem]">
      <h1 class="text-[1.8rem] pb-[1rem]">Members</h1>
      <hr class="border-t-2 border-black" />
    </div>
    <div
      class="members-ctn min-h-[35rem] h-[80vh] w-[100%] px-[3rem] pb-[3rem]"
    >
      <div
        class="w-[100%] h-[100%] bg-green-light rounded-[15px] flex flex-wrap content-start overflow-y-auto py-[1rem]"
      >
        <ChannelSettingsMembers
          v-for="member in members"
          :key="member.id"
          :mode="'members'"
          :userId="member.id"
          :username="member.pseudo"
          :avatar="member.avatar"
          :isAdmin="channelsStore.isAdmin(channelId, member.id)"
          :chanId="channelId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChannelSettingsMembers from "@/components/Channels/ChannelSettingsMembers.vue";
import { useChannelsStore } from "@/stores/channels";
import { ref, onBeforeMount } from "vue";
import router from "@/router";

const channelId = router.currentRoute.value.params.channelId as string;
const channelsStore = useChannelsStore();

let members = ref(channelsStore.channel(channelId)?.members);

async function refreshMembers() {
  await channelsStore.refreshChannels();
  await channelsStore.refreshAdmins(channelId);
  await channelsStore.refreshMembers(channelId);
  members.value = channelsStore.channel(channelId)?.members;
}

onBeforeMount(() => {
  refreshMembers();
});
</script>
