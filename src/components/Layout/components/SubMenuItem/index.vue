<template>
  <div v-show="!item.meta.invisible">
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0">
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <template v-for="child in item.children">
        <SubMenuItem :item="child" v-if="child.children && child.children.length"/>
        <el-menu-item v-else-if="!child.meta.invisible" :index="child.path">{{child.meta.title}}</el-menu-item>
      </template>
    </el-sub-menu>
    <el-menu-item :index="item.path === '/' ? '/home' :   item.path " v-else>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name:"SubMenuItem",
  props:{
    item:{
      type:Object,
      default:()=>([])
    }
  },
  setup(props){
    // console.log(props.item,'props')
  }
})
</script>

<style scoped>

</style>