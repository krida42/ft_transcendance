<template>
  <div class="about">
    <PongButton :angle="90"></PongButton>
    <h1 class="underline font-bold bg-blue-grey">This is</h1>
    <h1 class="underline font-bold cuicui">This is second</h1>
    <Icon class="rounded-full bg-black" size="50">
      <User />
    </Icon>
    <ChatBtnList>
      <!-- <ChatBtn start status="online">hey</ChatBtn>
      <ChatBtn status="offline">hey</ChatBtn>
      <ChatBtn status="online">heddy</ChatBtn>
      <ChatBtn end>hey</ChatBtn> -->
      <ChatBtn start status="online">hey</ChatBtn>
      <ChatBtn end status="online">Coucou toi comment ca va</ChatBtn>
    </ChatBtnList>
    <!-- <MyIcon>
      <Apple />
    </MyIcon> -->
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
import ChatBtnList from "@/components/ChatBtnList.vue";
import ChatBtn from "@/components/ChatBtn.vue";
// import MyIcon from "@/components/MyIcon.vue";
</script>
