<template>
  <div>
    <div v-if="!phaser">Chargement de Phaser...</div>
    <div v-else>Phaser est prêt à être utilisé!</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const phaser = ref(null);

onMounted(() => {
  import("phaser").then((Phaser: any) => {
    phaser.value = Phaser;
  });
});
</script>
