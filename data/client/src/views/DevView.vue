<template>
  <div class="dev">
    <h1>Pong</h1>
    <div class="button-wrapper mt-[5rem]">
      <button @click="deleteConfirmation" class="button-style dev-button">
        Delete all users
      </button>
      <button @click="refreshToken" class="button-style dev-button">
        Refresh token
      </button>
      <button @click="logout" class="button-style dev-button">Logout</button>
      <button class="button-style dev-button">Dev</button>
    </div>
    <div
      :class="showConfirmation ? 'block' : 'hidden'"
      class="w-[20rem] mx-auto my-[5rem]"
    >
      <p class="text-[1.5rem] uppercase font-bold m-[1rem] text-[#DA6C5D]">
        Are you sure?
      </p>
      <button @click="deleteUsers" class="button-style confirm-button">
        Yes</button
      ><button
        @click="showConfirmation = false"
        class="button-style confirm-button"
      >
        No
      </button>
    </div>
    <p class="text-[1.5rem] uppercase font-bold m-[3rem] text-[#DA6C5D]">
      {{ confirmationMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.button-style {
  margin: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 0.5rem;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.2rem;
}
.dev-button {
  background-color: $green-light;
  color: $green-dark;
  border: 0.2rem solid $green-dark;
  transition: all 0.2s ease-in-out;
}

.confirm-button {
  margin-left: 2rem;
  margin-right: 2rem;
  background-color: #e4887879;
  color: #da6c5d;
  border: 0.2rem solid #da6c5d;
}

.dev-button:hover {
  background-color: $green-dark;
  color: $green-light;
}
</style>

<script lang="ts" setup>
import { ref } from "vue";

const showConfirmation = ref(false);
const confirmationMessage = ref("");

function deleteConfirmation() {
  confirmationMessage.value = "";
  showConfirmation.value = true;
}

async function deleteUsers() {
  showConfirmation.value = false;
  confirmationMessage.value = "Users deleted";
  const response = await fetch(`${process.env.VUE_APP_CUICUI}:3001/users`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  console.log(data);
}

// function refreshConfirmation() {
//   confirmationMessage.value = "";
//   showConfirmation.value = true;
// }

async function refreshToken() {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_CUICUI}:3001/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function logout() {
  // Si les cookies sont vide alors on est déjà déconnecté et on ne peut pas se déconnecter
  const response = await fetch(
    `${process.env.VUE_APP_CUICUI}:3001/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  const data = await response.json();
  console.log(data);
}
</script>
