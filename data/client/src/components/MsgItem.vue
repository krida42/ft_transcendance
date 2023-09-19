<template>
  <div class="msg flex items-end mr-20 mb-10">
    <Icon class="avatar bd-redd mx-1" size="20" color="#eeeeee">
      <UserCircle />
    </Icon>
    <div class="content bd-cyand bg-blue-light rounded-t-xl rounded-ee-xl p-2">
      <div class="header flex justify-between">
        <span class="pseudo bd-redd text-red-700"
          >{{ props.pseudo }}Adrien</span
        >
        <span class="date text-xs bd-redd">{{ props.date }}14h</span>
      </div>
      <div class="main">
        <p class="text bd-redd text-start break-all">
          {{ props.content }}Salut ti comment ca vadw vladimir poutin
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pseudo {
  position: left;
}
</style>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Icon } from "@vicons/utils";
import { UserCircle } from "@vicons/tabler";

const props = defineProps({
  content: String,
  date: Date,
  direcion: String,
  pseudo: String,
});
</script>
