// 文档：https://v3.cn.vuejs.org/guide/typescript-support.html#%E4%B8%8E%E7%BB%84%E5%90%88%E5%BC%8F-api-%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8
import {ComponentCustomProperties,DefineComponent} from "vue";
declare module '*.vue' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core'{
  interface ComponentCustomProperties{
    $g_event:any,
    Bump:any
  }
}




