<template>
  <div>
    <canvas id="game-canvas" ref="gameCanvas" width="512" height="384"></canvas>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import * as PIXI from "pixi.js"

export default defineComponent({
  name: "parallaxScroller",
  data(): any {
    return {
      stage: null,
      renderer:null,
      midSprite:null,
      farSprite:null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const CanvasRef:any = this.$refs.gameCanvas
      this.stage = new PIXI.Container()
      // 让PIXI自己选择一个渲染器
      this.renderer = PIXI.autoDetectRenderer({width:512,height:384,view: CanvasRef});

      // 添加白天
      const farTexture = PIXI.Texture.from("http://bkfile.pjemmm.cn/bg-far.png");
      // 替换为切片精灵
      // this.farSprite = new PIXI.Sprite(farTexture)
      this.farSprite = new PIXI.TilingSprite(farTexture, 512, 256); // 替换为这一行代码
      this.farSprite.position.x = 0
      this.farSprite.position.y = 0
      this.farSprite.tilePosition.x = 0; // 插入此行
      this.farSprite.tilePosition.y = 0; // 插入此行
      this.stage.addChild(this.farSprite);

      // 添加黑夜
      const midTexture = PIXI.Texture.from("http://bkfile.pjemmm.cn/bg-mid.png")
      this.midSprite = new PIXI.TilingSprite(midTexture, 512, 256)
      this.midSprite.position.x = 0
      this.midSprite.position.y = 128
      this.midSprite.tilePosition.x = 0; // 插入此行
      this.midSprite.tilePosition.y = 0; // 插入此行
      this.stage.addChild(this.midSprite)

      window.requestAnimationFrame(this.update)
    },
    update(){
      this.farSprite.tilePosition.x -= 0.128
      this.midSprite.tilePosition.x -= 0.64
      this.renderer.render(this.stage)
      window.requestAnimationFrame(this.update)
    }
  }
})
</script>

<style scoped>
canvas {
  background-color: #222222;
}

</style>
