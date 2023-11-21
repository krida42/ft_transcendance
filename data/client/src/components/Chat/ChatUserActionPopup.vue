<template>
  <div
    class="chat-user-action-popup grid grid-rows-2 w-[18rem] h-[9rem] bg-black bg-opacity-80 rounded-xl text-white px-5 py-3"
  >
    <div class="user-info dbg-green-200 grid grid-cols-12 gap-x-3 items-center">
      <div class="user-avatar col-span-3 border-red-900 border-2d">
        <img
          :src="user?.avatar"
          alt="avatar"
          class="rounded-full w-[92%] mx-auto"
        />
      </div>
      <p
        class="user-name dbd-blue truncate col-span-8 self-center px-3 text-start"
      >
        {{ user?.pseudo }}
      </p>
      <Icon
        size="1.8rem"
        class="bd-blues self-start justify-self-end relative right-[-0.6rem] top-[-0.4rem] cursor-pointer"
        @click="emits('close')"
      >
        <X />
      </Icon>
    </div>
    <div class="actions flex justify-around dbg-red-200 items-center">
      <Transition name="slide-left">
        <button
          v-if="test"
          class="hover:bg-gray-500"
          :class="{
            // 'bg-green-500': addFriendAnimation,
            // 'hover:bg-green-500': addFriendAnimation,
            // 'bg-[#7c2c2c]': !addFriendAnimation,
            'add-friend-anim': addFriendAnimation,
          }"
          @click="sendFriendRequestHere()"
        >
          ADD FRIEND
        </button>
      </Transition>
      <button class="text-red-my hover:bg-[#7c2c2c]" @click="blockUserHere()">
        BLOCK
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@vicons/utils";
import { User, X } from "@vicons/tabler";
import { computed, defineEmits, defineProps, ref } from "vue";
import { useUsersStore } from "@/stores/users";
import { useFriendStore } from "@/stores/friend";

const props = defineProps({
  test: {
    type: Object as () => User,
    required: false,
  },
  uuid: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["close"]);

const usersStore = useUsersStore();
const friendStore = useFriendStore();

const user = computed(() => {
  return usersStore.users.get(props.uuid);
});

let addFriendAnimation = ref(false);

let test = ref(true);

function sendFriendRequestHere() {
  friendStore.sendFriendRequest(user.value!.id);
  if (!addFriendAnimation.value) {
    addFriendAnimation.value = true;
    setTimeout(() => {
      addFriendAnimation.value = false;
      test.value = false;
    }, 1500);
  }
}

function blockUserHere() {
  friendStore.blockUser(user.value!.id);
}
</script>

<style lang="scss" scoped>
.chat-user-action-popup {
  font-family: "Baumans";
}

button {
  //   background: #7c2c2c;
  border: 1px solid white;
  border-radius: 0.5rem;
  width: 45%;
  margin-top: 0.4rem;
  //   margin-bottom: 1rem;
  height: 2.3rem;
}

.add-friend-anim {
  // animation: color-progress 1s ease-in-out;
  animation: add-friend 0.8s ease-in-out 1 both;
}

@keyframes add-friend {
  from {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }

  10% {
    transform: scale(0.91);
    animation-timing-function: ease-in;
  }
  17% {
    transform: scale(0.98);
    animation-timing-function: ease-out;
  }
  33% {
    transform: scale(0.87);
    animation-timing-function: ease-in;
    background-color: $green-dark;
  }
  45% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-leave-to {
  // transform: translateX(-100%);
  opacity: 0;
}
</style>
