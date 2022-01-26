<template>
  <div class="el-menu-container">
    <el-menu
        router
        :default-active="route.path"
    >
      <SubMenuItem v-for="item in routes" :item="item"/>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import SubMenuItem from "./components/SubMenuItem/index.vue"
import event from "@/plugins/globalEvent"
const routes:any = ref([])
const route = useRoute()

// 生成嵌套的路由
function reSetRouter(router:any,parent=''){
  router.forEach((item:any) => {
    if (!item.meta.invisible){
      item.path = item.path === '/' ? item.path : parent +`${item.path.includes('/') ? '' : '/'}${item.path}`
      item.children && item.children.length && reSetRouter(item.children,item.path)
    }
  })
  return router
}

onMounted(()=>{
  const router = useRouter()
  routes.value = reSetRouter(event.deepClone(router.options.routes),'')
})

</script>

<style scoped lang="scss">
.el-menu-container{
  height: 100%;
  .el-menu-item{
    margin: 0;
  }
  .el-menu-vertical{
  }
  .el-menu{
    height: inherit;
  }
}

</style>
