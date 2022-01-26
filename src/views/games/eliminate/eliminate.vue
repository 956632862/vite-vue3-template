<template>
  <div ref="eliminateContainer">
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import * as PIXI from "pixi.js"
interface iData {
  canvas: any,
  state:Function,
  treasureHunter:any,
  treasureHunter_json:string,
  GameScene:any,
  explorer:any,
  bump:any,
  OverScene:any,
  blobs: Array<any>,
  message:any,
  healthBar:any,
  treasure:any
}

export default defineComponent({
  name: "eliminate",
  data(): iData {
    return {
      canvas: {},
      message:{},
      state:()=>{},
      // 缓存图像
      treasureHunter:null,
      treasureHunter_json:'http://bkfile.pjemmm.cn/treasureHunter.json',
      // 主要的游戏界面
      GameScene:null,
      // 猎人
      explorer:null,
      bump:null,
      blobs:[],
      OverScene:null,
      // 头部容器
      healthBar:{},
      // 宝箱
      treasure:{}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.canvas = new PIXI.Application({
        width: 512,
        height: 512,
        antialias: true,
        transparent: false,
        resolution: 1
      })
      // 将canvas添加到div下
      const CRef: any = this.$refs.eliminateContainer
      CRef.appendChild(this.canvas.view)
      // 缓存起来图片
      this.loader(this.treasureHunter_json,this.setUp)
      // 实例话碰撞检测
      this.bump = new Bump(PIXI)
    },
    // 初始化
    setUp(){
      const {canvas,treasureHunter_json}  = this
      this.state = this.play;
      // 渲染出场景，人物，宝箱
      this.renderGameElement()

      // 添加计时器
      canvas.ticker.add((delta:number) => this.gameLoop(delta))

      // 主要游戏场景 储存的是怪物的
      this.GameScene = this.Container()
      canvas.stage.addChild(this.GameScene)

      // 结束时的游戏场景
      this.OverScene = this.Container()
      this.OverScene.visible = false
      canvas.stage.addChild(this.OverScene)

      // 创建游戏文本
      this.message = new PIXI.Text('The End!',new PIXI.TextStyle({
        fontFamily: "Future",
        fontSize: 64,
        fill: "white"
      }))
      this.message.x = 120
      this.message.y = canvas.stage.height/2-32
      this.OverScene.addChild(this.message)

      // 加载缓存的图像
      this.treasureHunter = this.resources(treasureHunter_json).textures
      // 创建出血条
      this.createLifeBar()
      // 创建出怪物
      this.createBlob()
      // 添加移动函数
      this.handleMove()
    },
    // 监听移动
    handleMove(){
      let left = this.keyboard("ArrowLeft"),
        up = this.keyboard("ArrowUp"),
        right = this.keyboard("ArrowRight"),
        down = this.keyboard("ArrowDown");
      const {explorer} =  this
      left.press = () => {
          //Change the cat's velocity when the key is pressed
          explorer.vx = -5;
          explorer.vy = 0;
      }
      left.release = () => {
        if (!right.isDown && this.explorer.vy === 0) {
          explorer.vx = 0;
        }
      }
      //Up
      up.press = () => {
        explorer.vy = -5;
        explorer.vx = 0;
      };
      up.release = () => {
        if (!down.isDown && explorer.vx === 0) {
          explorer.vy = 0;
        }
      };

      //Right
      right.press = () => {
        explorer.vx = 5;
        explorer.vy = 0;
      };
      right.release = () => {
        if (!left.isDown && explorer.vy === 0) {
          explorer.vx = 0;
        }
      };

      //Down
      down.press = () => {
        explorer.vy = 5;
        explorer.vx = 0;
      };
      down.release = () => {
        if (!up.isDown && explorer.vx === 0) {
          explorer.vy = 0;
        }
      };
    },
    // 循环出游戏场景
    renderGameElement(){
      const {canvas}  = this
      // 创建游戏场景
      canvas.stage.addChild(this.Sprite(this.TextureCache("dungeon.png")))
      // 创建猎人
      const  explorer:any = this.Sprite(this.TextureCache("explorer.png"))
      explorer.y = canvas.stage.height/2
      explorer.x = 50
      explorer.vx =  explorer.vy = 0
      canvas.stage.addChild(explorer)
      this.explorer = explorer
      // 创建宝箱
      this.treasure = this.Sprite(this.TextureCache("treasure.png"))
      this.treasure.y = canvas.stage.height/2
      this.treasure.x = canvas.stage.width - 70
      canvas.stage.addChild(this.treasure)
    },
    // 循环游戏
    gameLoop(delta:number){
      this.state(delta);
    },
    play(delta:number){
      const {explorer,blobs} = this
      explorer.x += explorer.vx
      explorer.y += explorer.vy

      // 添加猎人边界检测限制猎人移动
      const {width,height,x,y} = this.canvas.stage
      this.bump.contain(explorer,{ x:x+20, y:y+20, width:512-40, height:512-40 }, true);

      // 添加怪物碰撞检测
      for (let i = 0; i < blobs.length; i++) {
        // 移动怪物
        blobs[i].y += blobs[i].vy;
        // 判断怪物是否碰到了墙壁，碰到了就返回
        this.bump.contain(blobs[i],{ x:x+20, y:y+20, width:512-40, height:512-40 }, true);

        // 检查是否猎人撞击到了怪物
        if (this.bump.hit(explorer,blobs[i],true,true)){
          // 减少血量
          const _width =  this.healthBar.outer.width - 10
          this.healthBar.outer.width = _width > 0 ?_width : 0;
          break;
        }
      }

      // 检查是否拿到了宝箱
      if (this.bump.hit(explorer, this.treasure)){
        this.message.text = '你赢了！'
        this.state = this.end
      }

      // 检查是否结束
      if (this.healthBar.outer.width <= 0){
        this.state = this.end
        this.message.text = '你输了！'
      }

    },
    end(){
      this.GameScene.visible = false
      this.OverScene.visible = true
    },
    // 创建出血条
    createLifeBar(){
      const {stage} = this.canvas
      // 血条的原理就是上下分别两个盒子，上面红色下面黑色
      // 创建头部的容器
      this.healthBar = this.Container()
      this.healthBar.position.set(stage.width - 170,4)
      this.GameScene.addChild(this.healthBar)

      // 创建血条底部的黑色内容
      const footerBlack = this.Graphics()
      footerBlack.beginFill(0x000000);
      footerBlack.drawRect(0, 0, 128, 8)
      footerBlack.endFill();
      this.healthBar.addChild(footerBlack);

      // 创建血条上面的内容
      const headRed = this.Graphics()
      headRed.beginFill(0xFF3300)
      headRed.drawRect(0, 0, 128, 8)
      headRed.endFill();
      this.healthBar.addChild(headRed);

      // 将头部添加在对象中,方便后续使用
      this.healthBar.outer = headRed;
    },
    // 创建出怪物
    createBlob(){
      let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150,
        speed = 5,  // 移动速度
        direction = 1;
      this.blobs  = [];
      const {stage} =  this.canvas
      const textures = this.treasureHunter['blob.png']
      for (let i = 0; i < numberOfBlobs; i++) {
        const blob:any = this.Sprite(textures)
        const x = spacing * i + xOffset;
        const y = this.$g_event.random(0, stage.height - blob.height);
        // 设置怪兽的位置
        blob.x = x;
        blob.y = y;
        // 设置怪兽的初始坐标y的方向跟速度
        blob.vy = speed * direction;
        // 分开间隔
        direction *= -1;
        this.blobs.push(blob);
        // 添加到主要容器中
        this.GameScene.addChild(blob)
      }
    },
    // 绘制图形
    Graphics(){
      return  new PIXI.Graphics();
    },
    Container(){
      return new PIXI.Container
    },
    // 读取缓存中的图片
    TextureCache(url: string) {
      return PIXI.utils.TextureCache[url]
    },
    // 加载图片到缓存
    loader(url: string, cb: Function) {
      return this.canvas.loader.add(url).load(cb)
    },
    // 读取加载结果
    resources(url: string) {
      return this.canvas.loader.resources[url]
    },
    // 创建精灵
    Sprite(texture: any) {
      return new PIXI.Sprite(texture)
    },
    /**
     * @param x
     * @param y
     * @param w
     * @param h
     * @constructor
     */
    Rectangle(x: number, y: number, w: number, h: number) {
      return new PIXI.Rectangle(x, y, w, h);
    },
    keyboard(value:string) {
      interface iKey {
        value?:string,
        isDown?:Boolean,
        isUp?:Boolean,
        press?:undefined | Function,
        release?:undefined | Function,
        downHandler?: Function,
        upHandler?: Function,
        unsubscribe?: Function,
      }

      let key:iKey = {};
      key.value = value;
      key.isDown = false;
      key.isUp = true;
      key.press = undefined;
      key.release = undefined;
      //The `downHandler`
      key.downHandler = (event:any) => {
        if (event.key === key.value) {
          if (key.isUp && key.press) key.press();
          key.isDown = true;
          key.isUp = false;
          event.preventDefault();
        }
      };

      //The `upHandler`
      key.upHandler = (event:any) => {
        if (event.key === key.value) {
          if (key.isDown && key.release) key.release();
          key.isDown = false;
          key.isUp = true;
          event.preventDefault();
        }
      };

      //Attach event listeners
      const downListener = key.downHandler.bind(key);
      const upListener = key.upHandler.bind(key);

      window.addEventListener(
        "keydown", downListener, false
      );
      window.addEventListener(
        "keyup", upListener, false
      );

      // Detach event listeners
      key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
      };

      return key;
    }
  }
})
</script>

<style scoped>

</style>
