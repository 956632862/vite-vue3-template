<template>
  <div>
    <ElConfigProvider :locale="locale">
      <router-view></router-view>
    </ElConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {ref} from "vue";
const locale = ref(zhCn)
</script>

<style lang="scss" scoped>
</style>
