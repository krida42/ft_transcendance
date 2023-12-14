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
        <div @click="deleteChannel(channelId)">Delete</div>
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
        <ChannelSettingsMembers
          @invite="inviteUser($event)"
          :class="privacy === 'Private' ? 'block' : 'hidden'"
          v-for="user in friendList"
          :key="user.id"
          :mode="'invite'"
          :userId="user.id"
          :username="user.pseudo"
          :avatar="user.avatar"
          :isAdmin="false"
          :chanId="channelId"
          :members="chanMembers"
          :invites="usersInvited"
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
  <ErrorPopup
    v-if="isErr"
    :statusCode="error.statusCode"
    :message="error.message"
    @close="isErr = false"
  />
</template>

<script lang="ts" setup>
import { useChannelsStore } from "@/stores/channels";
import { useFriendStore } from "@/stores/friend";
import { ref, computed, defineProps, onBeforeMount, watch } from "vue";
import { Channel } from "@/types";
import unknownLogo from "@/assets/svg/unknown-img.svg";
import ChannelSettingsMembers from "@/components/Channels/ChannelSettingsMembers.vue";
import { PrivacyType } from "@/types";
import router from "@/router";
import { FriendsTransformer } from "@/utils//friendsTransformer";
import { User } from "@/types";
import { ErrorPop } from "@/types";
import ErrorPopup from "@/components/ErrorPopup.vue";
import axios, { AxiosError } from "axios";

const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
});

const currentChannel = ref({} as Channel | undefined);
const privacy = ref(PrivacyType.Private);
const channelName = ref("");
const channelLogo = ref("");
const search_input = ref("");
const usersInvited = ref([] as string[]);
const friendStore = useFriendStore();
const friendList = computed(() => {
  return FriendsTransformer.beginWithLetters(
    FriendsTransformer.toArray(friendStore.friends),
    search_input.value
  );
});
const chanMembers = ref([] as User[]);
const channel = useChannelsStore();
const channelId = ref("");
const error = ref({} as ErrorPop);
const isErr = ref(false);

let files: FileList | null = null;
let file: File | null = null;

watch(privacy, () => {
  search_input.value = "";
});

const initInvites = (currentChannel: Channel) => {
  for (const invite of currentChannel.invites) {
    usersInvited.value.push(invite);
  }
};

const initChannel = async () => {
  await channel.refreshChannels();
  channelId.value = router.currentRoute.value.params.channelId as string;
  currentChannel.value = channel.channel(channelId.value);
  if (!currentChannel.value) return;
  await channel.refreshMembers(currentChannel.value.chanId);
  await channel.refreshInvites(currentChannel.value.chanId);
  chanMembers.value = currentChannel.value.members;
  channelName.value = currentChannel.value.chanName;
  privacy.value = currentChannel.value.chanType;
  if (currentChannel.value.imgName)
    channelLogo.value = currentChannel.value.imgName;
  initInvites(currentChannel.value);
};

onBeforeMount(() => {
  friendStore.refreshFriendList();
  if (props.formType === "edit") {
    initChannel();
  }
});

const onFileSelected = (e: Event) => {
  if (e) e.preventDefault();
  files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    channelLogo.value = e.target?.result as string;
  };
};

const createForm = async () => {
  const newChannel: Channel = {} as Channel;
  newChannel.chanName = channelName.value;
  newChannel.chanType = privacy.value;
  if (privacy.value !== PrivacyType.Protected && !search_input.value)
    search_input.value = "password";
  newChannel.chanPassword = search_input.value;

  channel
    .createChannel(newChannel)
    .then((chan) => {
      if (chan) {
        channel.refreshInvites(chan.chanId);
        if (file) channel.uploadChannelLogo(chan.chanId, file);
        for (const userId of usersInvited.value) {
          channel.inviteUser(chan.chanId, userId);
        }
      }
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

const editForm = async () => {
  let newChannel: Channel = {} as Channel;
  newChannel.chanName = channelName.value;
  newChannel.chanType = privacy.value;
  if (privacy.value !== PrivacyType.Protected && !search_input.value)
    search_input.value = "password";
  newChannel.chanPassword = search_input.value;

  channel
    .editChannel(newChannel, channelId.value)
    .then((chan) => {
      if (chan) {
        if (file) channel.uploadChannelLogo(chan.chanId, file);
        for (const userId of usersInvited.value) {
          channel.inviteUser(chan.chanId, userId);
        }
      }
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

const sendForm = props.formType === "create" ? createForm : editForm;

async function leaveChannel(channelId: string) {
  await channel.leaveChannel(channelId);
  router.push("/channels/my-channels");
}

async function deleteChannel(channelId: string) {
  await channel.deleteChannel(channelId);
  router.push("/channels/my-channels");
}

async function inviteUser(userId: string) {
  if (usersInvited.value.includes(userId)) {
    usersInvited.value = usersInvited.value.filter((id) => id !== userId);
  } else {
    usersInvited.value.push(userId);
  }
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
  top: -10px;
  left: 0px;
  position: relative;
  background-color: $yellow-hover;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 1px solid black;
}
</style>
