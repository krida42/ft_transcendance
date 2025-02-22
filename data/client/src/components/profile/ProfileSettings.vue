<template>
  <div class="grey-overlay absolute top-0 left-0 w-[100%] h-[100%] z-10">
    <form
      @submit.prevent="editProfile"
      class="profile-settings absolute top-[25%] left-[27%] w-[40%] h-[40%] bg-green-bg opacity-90 z-100 flex flex-col justify-center items-center gap-[15%] rounded-[15px]"
    >
      <img
        @click="$emit('closeSettings')"
        class="cross cursor-pointer absolute top-5 right-5 w-[30px]"
        src="@/assets/svg/cross_close.svg"
        alt="close"
      />
      <div class="user-info flex justify-around items-center w-[90%]">
        <div class="user-avatar flex items-center gap-[1rem]">
          <div class="w-[6rem] h-[6rem] rounded-full overflow-hidden">
            <img
              :src="avatar ? avatar : props.avatar"
              alt="avatar"
              class="object-cover w-[100%] h-[6rem]"
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
            class="pen w-[2rem] cursor-pointer"
          />
        </div>
        <div class="username">
          <input
            v-model="username"
            v-on:keydown.enter.prevent
            type="text"
            :placeholder="props.username"
            class="w-[12rem] h-[3rem] rounded-[15px] bg-transparent text-black text-[2rem] pl-[1rem]"
          />
        </div>
      </div>
      <div
        class="two-factor flex justify-center items-center gap-[1rem] w-[90%]"
      >
        <div
          class="two-factor-button bg-yellow-hover rounded-[15px] px-[1rem] pt-[0.15rem] h-[2rem] cursor-pointer text-[1.2rem] text-black uppercase"
          @click="twoFactor = !twoFactor"
        >
          {{ twoFactor ? "disable" : "enable" }}
        </div>
        <p class="normal-case text-[1.2rem]">Two factor authentification</p>
      </div>
      <button
        class="bg-yellow-hover absolute bottom-5 right-5 rounded-[15px] px-[1rem] h-[3rem] text-[1.5rem] text-black uppercase"
      >
        Save
      </button>
    </form>
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
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { useUsersStore } from "@/stores/users";
import { useMainStore } from "@/stores/main";
import router from "@/router";
import { ErrorPop } from "@/types";
import ErrorPopup from "@/components/ErrorPopup.vue";
import axios, { AxiosError } from "axios";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  twoFactor: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeSettings"]);

let files: FileList | null = null;
let file: File | null = null;
const username = ref(props.username);
const avatar = ref(props.avatar);
const twoFactor = ref(props.twoFactor);
const twoFactorInital = ref(props.twoFactor);
const usersStore = useUsersStore();
const mainStore = useMainStore();
const host = process.env.VUE_APP_API_URL;
const error = ref({} as ErrorPop);
const isErr = ref(false);

onMounted(() => {
  console.log("2FA VALUE: ", props.twoFactor);
});

const onFileSelected = (e: Event) => {
  console.log("2FA VALUE: ", props.twoFactor);
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
  if (twoFactor.value !== twoFactorInital.value) {
    if (twoFactor.value) {
      await axios.post(host + "/auth/2fa/turn-on"), { withCredentials: true };
      router.push("/auth/2FA-QR");
    } else {
      await axios.post(host + "/auth/2fa/turn-off"), { withCredentials: true };
    }
  }
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
        if (twoFactor.value === twoFactorInital.value || !twoFactor.value) {
          emit("closeSettings");
          window.location.href = `${process.env.VUE_APP_CUICUI}:8080/profile`;
        }
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

<style scoped lang="scss">
.grey-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.profile-settings {
  border-radius: 15px;
}
</style>
