<template>
<div class="container">
  <Skeleton :loading="loading">
    <div>
      <p>
        下面的p1
        <img class="img-test" style="background: #343640" src="https://bpic.51yuansu.com/pic2/cover/00/51/56/581682fbbb92e_610.jpg" alt="">
      </p>
      <p>下面的p2</p>
      <p>下面的p3</p>
    </div>
    <p>
      我里面还有其他元素
      <span>测试ss</span>
    </p>
    <img class="img-test" style="background: #343640" src="https://bpic.51yuansu.com/pic2/cover/00/51/56/581682fbbb92e_610.jpg" alt="">
    <p>我是P标签</p>
    <span>我是span标签</span>
    <MyComponent/>
  </Skeleton>
</div>
</template>

<script lang="ts">
import Skeleton from "@/components/Skeleton/index.vue"
import {defineComponent,h} from "@vue/runtime-core";
import NotFound from "@/views/NotFound/index.vue"
export default defineComponent({
  name: "skeleton",
  components:{Skeleton,'MyComponent':NotFound},
  data:()=>({
    loading:true
  }),
  mounted() {
    // setTimeout(()=>{
    //   this.loading = false
    // },4000)
  }
})
</script>

<style scoped lang="scss">
.container{
  .img-test{
    padding: 20px;
  }
  img{
    width: 50px;
    height: 50px;
  }
  div{
    margin: 10px 0;
  }
}

</style>
