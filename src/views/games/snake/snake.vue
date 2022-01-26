<template>
  <div ref="snakeContainer" class="snakeContainer">
    <!--蒙版-->
    <div class="snake-masking" v-if="!startGame">
      <p v-if="endGame">游戏结束！！</p>
      <el-button type="primary" @click="handleStarrGame">开始游戏</el-button>
    </div>
    <canvas
      ref="snakeCanvas"
      :width="canvasStyle.width"
      :height="canvasStyle.height"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import Snake from "@/views/games/snake/snake";

const whiteKey = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
export default defineComponent({
  data: () => ({
    timer: [] as any,
    canvas: {} as any,
    userSnake: [] as any,
    snakeWh: 20,   // 蛇的宽高
    stepNum: 1,  // 步进器
    snakeColor: "red", // 蛇的颜色
    bgColor: '#6b87fd',
    maxSnake:0, // snake的最大长度
    moveQueue: [] as any,
    startGame: false,
    endGame: false,  // 是否结束
    dotColor: 'yellow',
    canvasStyle: {width: 0, height: 0},
    dots: [] as any,
    // 当前按下的方向
    keyDown: {
      'ArrowUp': false,
      'ArrowRight': false,
      'ArrowDown': false,
      'ArrowLeft': true
    } as any
  }),
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const {snakeCanvas} = this.$refs as any
      this.canvas = snakeCanvas.getContext('2d')
      this.initCanvasOptions()
      this.initKeydownEvent()
    },

    // 添加按下监听
    initKeydownEvent() {
      window.addEventListener('keydown', this.handleKeydown, true)
      window.addEventListener('keyup', this.handleKeyup, true)
    },

    initCanvasOptions() {
      // 根据上级容器的宽高设置Canvas的宽高
      const {snakeWh} = this
      const parent: any = this.$refs.snakeContainer
      const {clientWidth, clientHeight} = parent
      const width = clientWidth - clientWidth % snakeWh
      const height = clientHeight - clientHeight % snakeWh
      this.canvasStyle = {width, height}
      // 计算出填满画布的长度，填满就赢了
      this.maxSnake = width/snakeWh * height/snakeWh
      // 填充
      this.$nextTick(() => {
        this.canvas.fillStyle = this.bgColor;
        this.canvas.fillRect(0, 0, width, height);
        // 生成玩家
        this.createUserSnake()
        // 生成吃的点
        this.createDot()
      })
    },

    // 开始游戏
    handleStarrGame() {
      this.startGame = true
      this.endGame = false
      // 监听移动，将移动的函数添加到moveQueue
      this.watchMoveSnake()
      // 计时器，每次都去拿出队列的函数进行调用
      this.timer.push(
        setInterval(()=>{
          // 判断是否已经达到最大数，是的话直接结束
          if (this.userSnake.length - 1 === this.maxSnake){
            this.handleEndGame()
            return false
          }
          const node = this.moveQueue.shift()
          if (node) {
            node()
            // 检查是否吃到了
            // this.watchEatDot()
          }
        },300)
      )
    },

    // 结束游戏
    handleEndGame() {
      // 清除所有的节点
      this.$nextTick(() => {
        this.startGame = false
        this.userSnake.forEach((node: any) => {
          this.canvas.fillStyle = this.bgColor;
          this.canvas.fillRect(node.x, node.y, node.w, node.h);
        })
        this.createUserSnake()
        // 清除队列
        this.moveQueue = []
        this.timer.map((n:any) => clearInterval(n))
      })
    },

    // 监听玩家的移动
    watchMoveSnake() {
      window.requestAnimationFrame(() => {
        this.handleMoveSnake()
        window.requestAnimationFrame(this.watchMoveSnake)
      })
    },

    // 监听是否吃到了点
    watchEatDot() {
      // 检查是否存在触碰到了某个点
      const head = this.userSnake[0]
      const {snakeWh} = this
      this.dots.forEach((dot: any) => {
        // 如果吃到点了
        if (head.x === dot.x && head.y === dot.y) {
          const endNode = this.userSnake[this.userSnake.length - 1]
          // 根据方向判断x,y应该如何加减
          const x = endNode.point === 'ArrowLeft' ? endNode.x + snakeWh :
            endNode.point === 'ArrowRight' ? endNode.x - snakeWh : endNode.x
          const y = endNode.point === 'ArrowUp' ? endNode.y + snakeWh :
            endNode.point === 'ArrowDown' ? endNode.y - snakeWh : endNode.y
          const node = {
            key: endNode.key + 1,
            x, y,
            point: endNode.point,
            num: dot.num,
            w: endNode.w,
            h: endNode.h
          }
          this.userSnake.push(node)
          this.canvas.fillStyle = this.snakeColor;
          this.canvas.fillRect(node.x, node.y, node.w, node.h);
          // 生成下一个点
          this.createDot()
        }
      })
    },

    // 生成玩家
    createUserSnake() {
      this.userSnake = []
      const {snakeWh} = this
      const {width, height} = this.canvasStyle
      const clientX = width / 2
      for (let i = 0; i <= 4; i++) {
        const x = clientX + (clientX % snakeWh) + (i * snakeWh);
        this.userSnake.push({
          key: i + 1, x,
          y: height - 60,
          w: snakeWh,
          h: snakeWh,
          num: 20,
          point: 'ArrowLeft'
        })
        this.canvas.fillStyle = this.snakeColor;
        this.canvas.fillRect(this.userSnake[i].x, this.userSnake[i].y, this.userSnake[i].w, this.userSnake[i].h);
      }
    },

    // 随机生成点
    createDot() {
      this.$nextTick(() => {
        this.dots = []
        if (this.dots.length <= 5) {
          const model = new Snake()
          const batchDot = model.batchCreateDot(this.$g_event.random(1, 1))
          // 绘制到画布的随机点上
          batchDot.forEach((item: object) => {
            const snakeDot: any = {...item, ...this.getRandomXy()}
            this.dots.push(snakeDot)
            this.canvas.fillStyle = this.dotColor;
            this.canvas.fillRect(snakeDot.x, snakeDot.y, snakeDot.w, snakeDot.h);
          })
        }
      })
    },

    // 获取画布上随机的坐标点，不能覆盖的另外一个点或者是蛇
    getRandomXy() {
      const {width, height} = this.canvasStyle
      const snakes = [...this.userSnake, ...this.dots]
      console.log(snakes)
      let respond: any = null
      let start = true
      while (!respond) {
        let x = this.$g_event.random(0, width - this.snakeWh)
        let y = this.$g_event.random(0, height - this.snakeWh)
        // 检查是否已经在该点存在点了,与是否已经超出边界
        const flag = snakes.some(n => {
          const x_flag = (x > n.x && x < n.x + n.w) || (x < n.x && x > n.x - n.w)
          const y_flag = (y > n.y && y < n.y + n.h) || (y < n.y && y > n.y - n.h)
          return y_flag || x_flag
        })
        if (!flag) {
          // 只取整数，避免麻烦
          respond = {x: x - (x % this.snakeWh), y: y - (y % this.snakeWh)}
          start = false
        }
      }
      return respond
    },

    // 抬起
    handleKeyup(options: any) {
      const {key} = options
      if (!whiteKey.includes(key)) return
      // 之后斜向的时候才需要
      // this.keyDown[key] = false
    },

    // 按下
    handleKeydown(options: any) {
      // 暂停游戏
      if (options.code === 'Space'){
        this.timer.map((n:number) => clearInterval(n))
        this.timer  = []
        return false
      }
      const {key} = options
      if (!whiteKey.includes(key)) return
      const head = {...this.userSnake[0]}
      // 只判断蛇头的方向不能往相反方向走
      if (head.point === 'ArrowUp' && key === 'ArrowDown') return;
      if (head.point === 'ArrowDown' && key === 'ArrowUp') return;
      if (head.point === 'ArrowRight' && key === 'ArrowLeft') return;
      if (head.point === 'ArrowLeft' && key === 'ArrowRight') return;
      // 暂时只能90度旋转，所以先做不可同时向两个方向移动
      for (const keyCode in this.keyDown) {
        this.keyDown[keyCode] = key === keyCode
      }
      // 修改蛇头的走向
      this.userSnake[0].point = key
      // 清空队列
      this.moveQueue = []
      // 马上执行一次
      this.renderSnakeLocation()

      // 发现暂停的重新开始计时
      if (!this.timer.length) this.handleStarrGame()
    },

    // 触发移动的动画
    handleMoveSnake() {
      const {keyDown} = this
      for (const keyDownKey in keyDown) {
        if (keyDown[keyDownKey]) {
          // 计算出移动的数据
          this.moveQueue.push(this.renderSnakeLocation)
          break;
        }
      }
    },

    // 计算出本次要移动的位置
    renderSnakeLocation() {
      if (this.endGame || !this.startGame) return
      const allData: any = [];
      /*
        在这里要保证每一个方向必须是有序的
        划分出每一个方向的数组，并且将它的上一个转向点保存下来
       */
      let pre_point: any = null
      const {userSnake} = this
      let nodes: any = [];
      userSnake.forEach((item: any, index: number) => {
        // 如果存在上一个转向点
        if (pre_point) {
          nodes.push(pre_point)
          pre_point = null
        }
        nodes.push(item)
        // 判断方向
        const next_node = this.userSnake[index + 1]
        if (next_node && next_node.point !== item.point) {
          // 不同的方向表示当前的节点需要分节了
          pre_point = this.$g_event.deepClone(item)
          allData.push(nodes)
          nodes = []
        }
        // 到达末尾
        if (index === this.userSnake.length - 1) {
          allData.push(nodes)
        }
      })
      // y:下加上减少 x:左减右加
      for (let j = 0; j < allData.length; j++) {
        if (this.endGame) break
        const nodes = allData[j]
        // 拿到转折点不参与移动计算
        const changeNode = nodes.find((n: any, i: number) => nodes[i + 1] && n.point !== nodes[i + 1].point)
        if (changeNode) nodes.shift()
        // 对剩下的节点做计
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          // 清除原本xy存在的节点
          this.canvas.fillStyle = this.bgColor;
          this.canvas.fillRect(node.x, node.y, node.w, node.h);
          // 根据自身的方向移动元素
          node.point === 'ArrowUp' && (node.y -= node.h)
          node.point === 'ArrowDown' && (node.y += node.h)
          node.point === 'ArrowLeft' && (node.x -= node.w)
          node.point === 'ArrowRight' && (node.x += node.w)

          // 如果存在转向点，并且发现当前元素已经到达转向点，改变当前元素的point
          if (changeNode && changeNode.x === node.x && changeNode.y === node.y) node.point = changeNode.point
          this.canvas.fillStyle = this.snakeColor;
          this.canvas.fillRect(node.x, node.y, node.w, node.h);
        }
        this.watchCrash()
      }
      this.watchEatDot();
    },


    // 碰撞检查,碰到边界或者是碰到自己，都得死,判断蛇头的位置就行了
    watchCrash() {
      const head = this.userSnake[0]
      // 游戏界面的大小
      const {width, height} = this.canvasStyle
      let endGame = false
      // 判断是否超出了边界范围
      if (head.x < 0 || head.x >= width || head.y >= height || head.y < 0) endGame = true
      // 判断是否撞到了自己
      if (!endGame) {
        for (let i = 1; i < this.userSnake.length; i++) {
          const node = this.userSnake[i]
          if (head.x === node.x && head.y === node.y) {
            endGame = true
            break;
          }
        }
      }
      this.endGame = endGame
      if (endGame) this.handleEndGame()
      return endGame
    }
  }
})
</script>

<style scoped lang="scss">
.snakeContainer {
  height: 100%;
  position: relative;
  display: flex;

  .snake-masking {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
