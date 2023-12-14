<template>
  <div class="about">
    <ArcadeButton :angle="90"></ArcadeButton>
    <h1 class="underline font-bold bg-blue-grey">This is</h1>
    <h1 class="underline font-bold cuicui">This is second</h1>
    <Icon class="rounded-full bg-black" size="50">
      <User />
    </Icon>
    <!-- <ChatMsgList /> -->
    <!-- <ChatBtnList> -->
    <!-- <ChatBtn start status="online">hey</ChatBtn>
      <ChatBtn status="offline">hey</ChatBtn>
      <ChatBtn status="online">heddy</ChatBtn>
      <ChatBtn end>hey</ChatBtn> -->
    <!-- <ChatBtn start status="online">hey</ChatBtn> -->
    <!-- <ChatBtn end status="online">Coucou toi comment ca va</ChatBtn> -->
    <!-- </ChatBtnList> -->
    <!-- <MyIcon>
      <Apple />
    </MyIcon> -->

    <h3>Status: {{ mainStore.status }}</h3>
    <h3>User info: {{ mainStore.userInfo }}</h3>
    <ChatAccessList />
    <ChatMsgList class="sticky top-10 left-[33%]" />
    <TestComp msg="coucou">
      <template v-slot:header><h2>Je sis le header</h2></template>
      <template v-slot>
        <h2>
          puipui du parent>>>>>>
          {{ puipui }}
        </h2>
      </template>
      <template v-slot:footer><h2>Je sis le footeer</h2></template>
    </TestComp>
    <ChatUserActionPopup
      uuid="kevin"
      class="absolute z-[10] top-[50%] left-[50%]"
    />
    <ChatUserActionPopup
      uuid="kevin"
      class="absolute z-[10] top-[50%] left-[1%]"
      admin
    />
    <h1>{{ puipui }}</h1>
    <h1>Etat du socket is connected?: {{ state.connected }}</h1>
  </div>
</template>

<style lang="scss" scoped>
.cuicui {
  background-color: pink;
}
</style>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { User } from "@vicons/tabler";
import ChatMsgList from "@/components/Chat/ChatMsgList.vue";
import TestComp from "@/components/TestComp.vue";
import ChatUserActionPopup from "@/components/Chat/ChatUserActionPopup.vue";
import axios from "axios";

import { useUsersStore } from "@/stores/users";
import { useFriendStore } from "@/stores/friend";
import { useMainStore } from "@/stores/main";

// import MyIcon from "@/components/MyIcon.vue";

import ChatAccessList from "@/components/Chat/ChatAccessList.vue";
import { ref } from "vue";

import { state, socket } from "@/socket";

const mainStore = useMainStore();

axios
  .patch(`${process.env.VUE_APP_CUICUI}:3001/users`, {
    pseudo: Math.random().toString(),
  })
  .then((res) => {
    console.log("PATCH res", res);
  });

axios.get(`${process.env.VUE_APP_CUICUI}:3001/auth/test`).then((res) => {
  console.log("res", res);
});

const usersStore = useUsersStore();
const friendStore = useFriendStore();

// usersStore.refreshUser("marine");
// usersStore.refreshUser("kevin");
// usersStore.refreshUser("vincent");

friendStore.refreshFriendList();

const puipui = ref("Je fais puiui");

class TestClass {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  getname() {
    return this.name;
  }
}

console.log(
  "test de testcalass tringified",
  JSON.stringify(new TestClass("kevin"))
);
</script>
