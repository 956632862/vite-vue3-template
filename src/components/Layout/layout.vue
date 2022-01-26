<template>
  <el-container class="layout-container">
    <el-aside width="180px">
      <MAside/>
    </el-aside>
    <el-container>
      <el-header><MHeader/></el-header>
      <el-main class="layout-main">
        <router-view/>
      </el-main>
      <el-footer><MFooter/></el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import MHeader from "./MHeader.vue";
import MFooter from "./MFooter.vue";
import MAside from "./MAside.vue"
</script>

<style scoped lang="scss">
.layout-container{
  height: 100vh;
  .el-header{
    background-color:  #343640 ;
  }
  .el-footer{
    background-color: var(--footer-background-color);
  }
  .layout-main{
    background-color: var(--main-background-color);
  }
}

</style>
