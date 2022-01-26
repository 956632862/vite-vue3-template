<script>
import {defineComponent,h} from "vue";
// 生命周期
// init(初始化)、insert(插入)、prepatch(更新)、destroy(销毁)
export default defineComponent({
  name: "index",
  // 抽象组件的属性
  abstract: true,
  props:{
    loading:{
      type:Boolean,
      default:true
    },
  },
  methods:{
    reSlots(slots) {
      slots.forEach(slot => {
        const {children} = slot
        const ChildType = this.$g_event.getDataType(children)
        // 识别文本节点，将文本删除
        if (slot.el && slot.el.nodeType === 3) {
          slot.el['_textContent'] = slot.el.textContent
          slot.el.textContent = ''
          if ( slot.el.nextElementSibling){
            slot.el.nextElementSibling['_textContent'] =  slot.el.nextElementSibling.textContent
            slot.el.nextElementSibling.textContent = ''
          }
        }
        if (slot.el.nodeType !== 3) {
          slot.el.classList.add('inSkeleton')
        }
        ChildType === 'Array' && this.reSlots(children)
      })
    },
    handleVNode (slots)  {
      // 需要替换元素的类型
      const replaceType = ['img'];
      // 在真实的Dom未产生之前，对img进行处理
      slots.forEach(slot => {
        const div =document.createElement('div')
        // 直接把处理不了的元素全部用div替换掉
        const {props,children,type} = slot
        if (replaceType.includes(type)){
          // 有需要添加的类 只能在这里添加
          props.class = `${props.class} inSkeleton-img`
          props.style && (div.style =  props.style)
          props.class && (div.classList = props.class)
          slot.type = 'div'
          slot.el = div
        }
        const ChildType = this.$g_event.getDataType(children)
        ChildType === 'Array' && this.handleVNode(children)
      })
    }
  },
  render(){
    const _slots = this.$slots.default() || h([''])
    if (!this.loading) return _slots
    const slots = this.$g_event.deepClone(_slots)
    const  {length} = slots
    // 在真实dom未渲染完成之前对需要替换的元素做操作
    this.handleVNode(slots)
    // 对真实Dom进行操作
    this.$nextTick().then(res =>{
      this.reSlots(slots)
    })
    return length > 0 ? h('div',{},slots) : slots
  },
})
</script>

<style lang="scss">
.inSkeleton-img{
  display: inline-block;
}
.inSkeleton{
  background: #cec8c8 !important;
  color: #cec8c8 !important;
  //pointer-events:none;
  user-select:none;
  position: relative;
  animation: inSkeletonFrame 2s   infinite alternate;
  border: none !important;
  *{
    border: none !important;
  }
}
@keyframes inSkeletonFrame {
  0%{
    background: #cec8c8;
    color:#cec8c8;
  }
  100%{
    background: #343640;
    color:#343640;
  }
}

</style>
