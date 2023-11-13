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
        class="w-[100%] h-[100%] bg-green-light rounded-[15px] overflow-scroll"
      >
        <ul class="my-channels-list">
          <MyChannelItem
            v-for="(channel, index) in myChannelsList"
            :key="channel.id"
            :name="channel.name"
            :logo="channel.logo"
            :members="channel.members"
            :is_owner="channel.is_owner"
            :index="index"
            :len="myChannelsList.length"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MyChannelItem from "@/components/Channels/MyChannelItem.vue";
import axios from "axios";
import { ref, onBeforeMount } from "vue";
import { Channel } from "@/types";

const host = process.env.VUE_APP_API_URL;
const myChannelsList = ref<Channel[]>([]);

async function getMyChannels() {
  axios
    .get(host + "/channels/my-channels")
    .then((res) => {
      myChannelsList.value = res.data;
      console.log(res.data);
    })
    .catch((err) => console.log(err));
}

onBeforeMount(() => {
  getMyChannels();
});
</script>

<style lang="scss" scoped></style>
