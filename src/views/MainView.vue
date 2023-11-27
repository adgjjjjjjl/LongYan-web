<template>
  <div>main view</div>
</template>

<script setup>
import * as echarts from "echarts";

import { RouterView, useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted } from "vue";

/// 声明定义一下echart
let echart = echarts;
const footer_des = computed(() => {
  const date = new Date();
  return ` Copyright ©${date.getFullYear()} AIG, All Rights Reserved.`;
});
let currentKey = ref([0]);
const router = useRouter();
const route = useRoute();

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
