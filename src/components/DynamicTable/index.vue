<script lang="tsx">
import {defineComponent} from "vue";
import {isEmpty} from "element-plus/es/utils/util";

export default defineComponent({
  name: "DynamicTable",
  props: {
    parentDom: Object,
    // 表格项
    columns: {
      type: Array,
      default: () => ([])
    },
    // 表格的配置
    options: {
      type: Object,
      default: () => ([])
    },
    // 操作按钮组
    operations: {
      type: Object,
      default: () => ({})
    },
    // 表格的数据
    tableData: {
      type: Array,
      default: () => ([])
    },
    // 分页配置
    pagination:{
      type:Object,
      default:()=>({})
    }
  },
  setup({columns, tableData, options, operations, parentDom,pagination}, ctx: any) {

    // 删除掉要自定义的字段
    const deleteField = (column: any) => {
      delete column['align']
      return column
    }

    const handleFn = (handleName:string,params:any = null) => {
      return parentDom && parentDom[handleName] && parentDom[handleName](params)
    }

    // 渲染操作按钮
    const renderOperations = () => {
      if (!isEmpty(operations)) {
        const list = operations.list
        const slots = {
          default: ({row, column, $index}: any) => {
            if (ctx.slots['operations']) return ctx.slots['operations']()
            return (
              list.map((button: any) => {
                return <el-button {...button} onClick={() => {
                  return handleFn(button.click,{row, column, $index})
                }}>{button.label}</el-button>
              })
            )
          },
          header: ({column, $index}: any) => {
            if (ctx.slots['operations_header']) return ctx.slots['operations_header'](column, $index)
            return (
              <span>{column.label}</span>
            )
          }
        }
        return <el-table-column {...operations} v-slots={slots}/>
      }
    }

    // 渲染分页
    const renderPagination = () => {
      return (
        <el-pagination
          class="pagination" {...pagination}
          onSizeChange={(page:number|string)=> handleFn(pagination['size-change'],page)}
          onCurrentChange={(page:number|string)=> handleFn(pagination['page-change'],page)}
          onPrevClick	={(page:number|string)=> handleFn(pagination['page-change'],page)}
          onNextClick	={(page:number|string)=> handleFn(pagination['page-change'],page)}
        />
      )
    }

    return () => (
      <div>
        <el-table
          data={tableData} {...options}
          onSelectionChange={(selection: any) => handleFn(options['selection-change'],selection)}
        >
          {
            columns.map((n: any) => {
              const {align}: any = n
              // 可以根据某一列自定义位置
              const _align = align || options.align || 'center'
              // 删除自定义的字段
              deleteField(n)
              // 定义插槽
              const slots = {
                default: ctx.slots[`${n.prop}_content`] ? ctx.slots[`${n.prop}_content`] : null,
                header: ctx.slots[`${n.prop}_header`] ? ctx.slots[`${n.prop}_header`] : null
              }
              return <el-table-column
                align={_align}
                {...n}
                v-slots={n.type === 'selection' ? null : slots}
              />
            })
          }
          {renderOperations()}
        </el-table>
        { !isEmpty(pagination) && renderPagination()}
      </div>

    )
  }
})
</script>

<style scoped lang="scss">
.pagination{
  margin: 10px 0 0 0 ;
}

</style>
