<template>
  <form
    @submit.prevent="sendForm"
    class="create-channel min-h-[100vh] flex flex-col justify-evenly items-center"
  >
    <div
      class="general-options w-[90%] h-[20vh] flex justify-start items-center gap-[2rem] px-[2rem] pb-[2rem] border-b-2 border-black"
    >
      <div class="chan-logo flex items-center gap-[1rem]">
        <img
          :src="channelLogo ? channelLogo : unknownLogo"
          class="aspect-square w-[8rem]"
        />
        <input
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFileSelected"
          ref="fileInput"
        />
        <img
          src="@/assets/svg/pen.svg"
          @click="($refs.fileInput as HTMLInputElement).click()"
          class="pen"
        />
      </div>
      <div class="chan-name">
        <input
          v-model="channelName"
          type="text"
          placeholder="channel name"
          class="w-[15rem] h-[3rem] rounded-[15px] bg-transparent text-black text-[2rem] pl-[1rem]"
        />
      </div>
    </div>
    <div class="privacy-status flex gap-[2rem] self-start ml-[3rem]">
      <div class="radio-btn">
        <input
          v-model="privacy"
          type="radio"
          id="private"
          name="privacy"
          value="private"
          checked
        />
        <label for="private">private</label>
      </div>
      <div class="radio-btn">
        <input
          v-model="privacy"
          type="radio"
          id="public"
          name="privacy"
          value="public"
        />
        <label for="public">public</label>
      </div>
      <div class="radio-btn">
        <input
          v-model="privacy"
          type="radio"
          id="protected"
          name="privacy"
          value="protected"
        />
        <label for="protected">protected</label>
      </div>
    </div>
    <div class="chan-options min-h-[25rem] h-[50vh] w-[100%] px-[3rem]">
      <div class="w-[100%] h-[100%] bg-green-light rounded-[15px]"></div>
    </div>
    <div class="submit-btn w-[90%] flex justify-end">
      <button
        type="submit"
        class="bg-yellow-hover rounded-[15px] px-[1rem] h-[3rem] text-[1.5rem] text-black uppercase"
      >
        create
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import channel from "@/api/channel";
import { ref } from "vue";
import { Channel } from "@/types";
import unknownLogo from "@/assets/svg/unknown-img.svg";

const privacy = ref("");
const channelName = ref("");
const channelLogo = ref("");
let files: FileList | null = null;
let file: File | null = null;

const onFileSelected = (e: Event) => {
  if (e) e.preventDefault();
  files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    channelLogo.value = e.target?.result as string;
    console.log(channelLogo.value);
  };
};

const sendForm = () => {
  if (!file) return;
  let newChannel: Channel = {} as Channel;
  const fd = new FormData();
  // fd.append("name", channelName.value);
  // fd.append("privacy", privacy.value);
  fd.append("image", file, file.name);
  // fd.append("owner", user.getUser().id); demander a Kevin comment recuperer l'id de l'utilisateur courant
  // fd.append("users", user.getUser().id); ajouter les users invites par l'utilisateur si privacy == private
  newChannel.id = "";
  newChannel.name = channelName.value;
  newChannel.privacy = privacy.value;
  newChannel.logo = fd;
  channel.createChannel(newChannel);
};
</script>

<style lang="scss" scoped>
.pen {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}
.radio-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
}

input[type="radio"]:checked:after {
  width: 13px;
  height: 13px;
  border-radius: 15px;
  top: -9px;
  left: 0px;
  position: relative;
  background-color: $yellow-hover;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 1px solid black;
}

button {
  font-family: "Baumans", cursive;
}
</style>
