<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";

onMounted(() => {
  console.log("App.vue");
});
</script>

<template>
  <router-view />
</template>

<style lang="scss" scoped></style>
