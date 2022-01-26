<template>
  <div class="m-header">
    <div class="theme-check">
      <span>{{themeColor ? '关闭' : '开启'}}暗黑模式</span>
      <el-switch v-model="themeColor" @change="handleChangeTheme"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from "vue";
let themeColor:any = ref(false)

// mounted
onMounted(()=>{
  const flag = localStorage.getItem('theme')
  themeColor.value = flag === 'dark-theme'
  handleChangeTheme()
})

function handleChangeTheme(){
  const {value} = themeColor
  const theme:string = value ? 'dark-theme' : 'default-theme'
  // 将模式缓存到本地
  localStorage.setItem('theme', theme)
  document.documentElement.className = theme
}

</script>

<style scoped lang="scss">
.m-header{
  display:flex;
  align-items:center;
  height:100%;
  .theme-check{
    color:#ffffff;
    font-size:12px;
    display: flex;
    align-items: center;
  }

  :deep(.color-picker){
     .el-color-picker__trigger{
        .el-icon{
        position: absolute;
      }
    }
  }
}
</style>
