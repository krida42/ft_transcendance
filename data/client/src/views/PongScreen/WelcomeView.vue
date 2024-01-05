<template>
  <div class="pong-screen flex flex-col justify-evenly items-center p-[1rem]">
    <p class="leading-tight">
      Welcome! Would you like to <br />
      change your informations?
    </p>
    <div class="profile-info flex justify-center items-center gap-[1rem]">
      <div class="user-avatar flex items-center gap-[1rem]">
        <div class="w-[5rem] h-[5rem] rounded-full overflow-hidden">
          <img
            :src="avatar"
            alt="avatar"
            class="object-cover w-[100%] h-[5rem]"
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
          src="@/assets/svg/pen-white.svg"
          @click="($refs.fileInput as HTMLInputElement).click()"
          class="pen w-[1.6rem] cursor-pointer"
        />
      </div>
      <div class="username">
        <input
          v-model="username"
          v-on:keydown.enter.prevent
          type="text"
          class="w-[10rem] h-[2.6rem] rounded-[15px] bg-transparent text-white text-[1.6rem] pl-[1rem] border border-white"
        />
      </div>
    </div>
    <div class="w-[100%] flex justify-evenly">
      <button
        @click="router.push('/main/home')"
        class="pong-screen-button border border-white w-[6rem]"
      >
        LATER
      </button>
      <button
        @click="editProfile"
        class="pong-screen-button border border-white w-[6rem]"
      >
        SAVE
      </button>
    </div>
  </div>
  <ErrorPopup
    v-if="isErr"
    :statusCode="error.statusCode"
    :message="error.message"
    :overlay="false"
    @close="isErr = false"
  />
</template>
<script lang="ts" setup>
import router from "@/router";
import { useUsersStore } from "@/stores/users";
import { useMainStore } from "@/stores/main";
import { onBeforeMount, ref } from "vue";
import { User } from "@/types";
import { ErrorPop } from "@/types";
import ErrorPopup from "@/components/ErrorPopup.vue";
import axios, { AxiosError } from "axios";

const usersStore = useUsersStore();
const mainStore = useMainStore();

const user = ref<User>(usersStore.currentUser);
const avatar = ref<string>(user.value.avatar);
const username = ref<string>(user.value.pseudo);
const error = ref({} as ErrorPop);
const isErr = ref(false);

let files: FileList | null = null;
let file: File | null = null;

const initUser = () => {
  usersStore.refreshUser(usersStore.currentUser.id);
  user.value = usersStore.currentUser;
};

onBeforeMount(() => {
  initUser();
});

const onFileSelected = (e: Event) => {
  if (e) e.preventDefault();
  files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    avatar.value = e.target?.result as string;
  };
};

const editProfile = async () => {
  const profile = {
    pseudo: username.value,
  };
  try {
    if (file) await usersStore.uploadUserAvatar(file);
  } catch (err: AxiosError | Error) {
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
  }
  usersStore
    .editUser(profile)
    .then(() => {
      mainStore.refreshUserInfo().then(() => {
        router.push("home");
      });
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
</script>

<style lang="scss" scoped>
button {
  border: 2px solid black;
  padding-inline: 4px;
}
button:hover {
  border-bottom: 2px solid white;
}
</style>
