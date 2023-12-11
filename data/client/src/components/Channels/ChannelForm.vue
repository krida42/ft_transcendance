<template>
  <form
    @submit.prevent="sendForm"
    class="create-channel min-h-[100vh] flex flex-col justify-evenly items-center"
  >
    <div
      class="general-options w-[90%] h-[20vh] flex justify-start items-center gap-[2rem] px-[2rem] pb-[2rem] border-b-2 border-black"
    >
      <div class="chan-logo flex items-center gap-[1rem]">
        <div class="w-[8rem] h-[8rem] rounded-full overflow-hidden">
          <img
            :src="channelLogo ? channelLogo : unknownLogo"
            class="object-cover w-[100%] h-[8rem]"
          />
        </div>
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
          v-on:keydown.enter.prevent
          type="text"
          :placeholder="
            props.formType === 'create' ? 'channel name' : channelName
          "
          class="w-[15rem] h-[3rem] rounded-[15px] bg-transparent text-black text-[2rem] pl-[1rem]"
        />
      </div>
      <div
        class="leave-buttons-container flex flex-col gap-[1rem] ml-auto mr-[1rem]"
        v-if="$props.formType === 'edit'"
      >
        <div @click="leaveChannel(channelId)">Leave</div>
        <div @click="() => channel.deleteChannel(channelId)">Delete</div>
      </div>
    </div>
    <div class="privacy-status flex gap-[2rem] self-start ml-[3rem]">
      <div class="radio-btn">
        <input
          v-model="privacy"
          type="radio"
          id="private"
          name="privacy"
          value="Private"
          :checked="privacy === 'Private' ? true : false"
        />
        <label for="private">private</label>
      </div>
      <div class="radio-btn">
        <input
          v-model="privacy"
          type="radio"
          id="public"
          name="privacy"
          value="Public"
          :checked="privacy === 'Public' ? true : false"
        />
        <label for="public">public</label>
      </div>
      <div class="radio-btn">
        <input
          v-model="privacy"
          type="radio"
          id="protected"
          name="privacy"
          value="Protected"
          :checked="privacy === 'Protected' ? true : false"
        />
        <label for="protected">protected</label>
      </div>
    </div>
    <div class="chan-options min-h-[25rem] h-[50vh] w-[100%] px-[3rem]">
      <div
        :class="privacy === 'Public' ? 'hidden' : 'block'"
        class="w-[100%] h-[100%] bg-green-light rounded-[15px] flex flex-wrap content-start gap-[1rem] p-[2rem] overflow-y-auto overflow-x-hidden"
      >
        <input
          v-model="search_input"
          type="text"
          :placeholder="
            privacy === 'Private'
              ? 'search for friends...'
              : 'set a password...'
          "
          class="w-[100%] h-[3rem] rounded-[15px] bg-yellow-hover text-black text-[1.2rem] pl-[1rem]"
        />
        <user-action
          :class="privacy === 'Private' ? 'block' : 'hidden'"
          v-for="user in friendList"
          :key="user.id"
          :uuid="user.id"
          :mode="'channel'"
        />
      </div>
    </div>
    <div class="submit-btn w-[90%] flex justify-end">
      <button
        type="submit"
        class="bg-yellow-hover rounded-[15px] px-[1rem] h-[3rem] text-[1.5rem] text-black uppercase"
      >
        {{ props.formType === "create" ? "create" : "save" }}
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useChannelsStore } from "@/stores/channels";
import { useFriendStore } from "@/stores/friend";
import { useUsersStore } from "@/stores/users";
import { ref, computed, defineProps } from "vue";
import { Channel } from "@/types";
import unknownLogo from "@/assets/svg/unknown-img.svg";
import UserAction from "@/components/UserAction.vue";
import { PrivacyType } from "@/types";
import { User } from "@/types";
import router from "@/router";
import { FriendsTransformer } from "@/utils//friendsTransformer";

const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
});

const privacy = ref(PrivacyType.Private); //change the initialization to get the privacy of the channel if it's an edit form
const channelName = ref(""); //change the initialization to get the name of the channel if it's an edit form
const channelLogo = ref(""); //change the initialization to get the logo of the channel if it's an edit form
const search_input = ref("");
const friendStore = useFriendStore();
const friendList = computed(() => {
  return FriendsTransformer.beginWithLetters(
    FriendsTransformer.toArray(friendStore.friends),
    search_input.value
  );
});
const user = useUsersStore();
const userId = computed(() => user.currentUser.id);
const channel = useChannelsStore();
const channelId = computed(() => {
  return props.formType === "edit"
    ? (router.currentRoute.value.params.channelId as string)
    : "";
});

let files: FileList | null = null;
let file: File | null = null;

(() => {
  friendStore.refreshFriendList();
})();

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

const createForm = async () => {
  const newChannel: Channel = {} as Channel;
  newChannel.chanName = channelName.value;
  newChannel.chanType = privacy.value;
  newChannel.chanPassword = search_input.value;
  await channel.createChannel(newChannel);
  router.push("/channels/my-channels");
};

const editForm = () => {
  let newChannel: Channel = {} as Channel;
  const fd = new FormData();
  // fd.append("name", channelName.value);
  // fd.append("privacy", privacy.value);
  // fd.append("owner", user.getUser().id); demander a Kevin comment recuperer l'id de l'utilisateur courant
  // fd.append("users", user.getUser().id); ajouter les users invites par l'utilisateur si privacy == private
  newChannel.chanId = "";
  newChannel.chanName = channelName.value;
  newChannel.chanType = privacy.value;
  newChannel.logo = fd;
  channel.createChannel(newChannel);
};

const sendForm = props.formType === "create" ? createForm : editForm;

async function leaveChannel(channelId: string) {
  await channel.leaveChannel(channelId);
  router.push("/channels/my-channels");
}
</script>

<style lang="scss" scoped>
form {
  font-family: "Baumans", cursive;
}
.pen {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.leave-buttons-container > * {
  width: 100%;
  padding: 0.25rem 0.8rem 0.25rem 0.8rem;
  border-radius: 15px;
  border: 2px solid black;
  background-color: transparent;
  font-size: 1.5rem;
  text-transform: uppercase;
  color: $red-my;
  cursor: pointer;
}

.leave-buttons-container > *:hover {
  background-color: $red-my;
  color: white;
}
.radio-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
}

label {
  cursor: pointer;
}

input[type="radio"] {
  cursor: pointer;
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
</style>
