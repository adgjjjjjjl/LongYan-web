<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

onMounted(() => {
  console.log("App.vue");
});
</script>

<template>
  <a-config-provider :local="zhCN">
    <template #renderEmpty>
    <div class="no_data">
      <span class="nodata_mess">当前无数据</span>
    </div>
    </template>
    <router-view />
  </a-config-provider>
</template>

<style lang="scss" scoped></style>
