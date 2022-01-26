<template>
<div>
    <div id="zRender-canvas" class="zRenderCanvas" ref="zRenderCanvas"></div>
</div>
</template>

<script lang="ts">
import * as zrender from "zrender"
import {defineComponent} from "vue";

interface iData {
  canvas:Object | null
}

export default defineComponent({
  name:'toweDefence',
  data():iData{
    return {
      canvas:null
    }
  },
  mounted() {
    const WH = 20;
    // 行 列
    const width = WH * 35
    const height = WH * 20
    const ref:any = this.$refs.zRenderCanvas
    this.canvas = zrender.init(ref,{width,height})
    console.log(this.canvas)
  }
})
</script>

<style scoped lang="scss">
  .zRenderCanvas{
    background: #464343;
    width: max-content;
  }

</style>
