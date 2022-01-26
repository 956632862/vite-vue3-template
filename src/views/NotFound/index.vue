<template>
<div class="notFound-container">
   <span class="title">404</span>
</div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
onMounted(()=>{
  const flag:any = localStorage.getItem('theme')
  document.documentElement.className = flag
})
</script>

<style scoped lang="scss">
.notFound-container{
  width: 100vw;
  height: 100vh;
  background-color: var(--main-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  .title{
    font-size: 120px;
    border-bottom: 3px solid #ffffff;
  }
}

</style>