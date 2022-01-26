<template>
<div>
  <DynamicTable
    :parentDom="this"
    :columns="columns"
    :tableData="tableData"
    :operations="operations"
    :pagination="pagination"
    :options="options"
  >
    <template v-slot:name_header>
      <h2>我是name的表头</h2>
    </template>
    <template v-slot:name_content="slotProps">
      <el-input v-model="slotProps.row.name" placeholder="Please input" />
    </template>
  </DynamicTable>
</div>
</template>

<script lang="tsx">
import {defineComponent} from "@vue/runtime-core";
import DynamicTable from "@/components/DynamicTable/index.vue"
export default defineComponent({
  name: "DynamicTable",
  components:{DynamicTable},
  /**
   * Vue3 不建议再使用mixins,因为有了setUp
   */
  setup(){
    const columns:Array<T> = [
      {
        type:'selection'
      },
      {
        label:'姓名',
        prop:'name',
      },
      {
        label:'性别',
        prop:'sex'
      },
      {
        label:'年龄',
        prop:'num',
      }
    ]

    const tableData:Array<any> = [
      {name:'1', sex:'男', num:12,},
      {name:'2', sex:'男', num:12},
      {name:'3', sex:'男', num:12},
    ]

    const options = {
      border:true,
      // 'selection-change':'handleSelectionChange'
    }

    const operations = {
      label:'操作按钮',
      list:[
        {
          type:'text',
          label:'测试',
          click:'handleClickTest'
        }
      ]
    }

    const pagination = {
      pageSize:2,
      'page-count':1000,
      'size-change':'handleSizeChange',
      'page-change':'handlePageChange'
    }
    return {
      pagination,
      columns,
      tableData,
      options,
      operations,
    }
  },
  methods:{
    handleClickTest(){
      console.log('测试')
      console.log('拿到当前实例',this.operations)
    },
    handlePageChange(index:number|string){
      console.log('修改当前页',index)
    },
    handleSelectionChange(section:any){
      console.log('选择了什么',section)
    },
    handleSizeChange(index:number|string){
      console.log('修改了分页数',index)
    }
  }
})
</script>

<style scoped>

</style>
