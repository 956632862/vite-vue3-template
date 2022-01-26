import {createRouter, createWebHistory, RouteRecordRaw,RouterView} from 'vue-router'
import NotFound from "@/views/NotFound/index.vue"
import Layout from "@/components/Layout/layout.vue"
/**
 * @description 路线表
 * @param meta {
 *     title:'菜单栏名称',
 *     auth：'是否需要权限校验'
 *     invisible：'不展示在菜单中'
 * }
 */

// 需要权限校验的路由
const requireAuthRoutes:Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        redirect:"/home",
        meta:{
            title:'首页',
            auth:false
        },
    },
    {
        path: '/home',
        component:Layout,
        meta:{
            title:'首页2',
            auth:false,
            invisible:true
        },
        children:[
            {
                path: '/home',
                meta:{title:1},
                component:  () => import("@/views/home/index.vue")
            }
        ]
    },
  {
    path: '/game',
    meta:{
      title:'趣味游戏',
      auth:false
    },
    component:Layout,
    children:[
      {
        path: 'parallaxScroller',
        meta:{
          title:'无限滚动地图',
          auth:false
        },
        component:()=>import("@/views/games/parallaxScroller/parallaxScroller.vue"),
      },
      {
        path: 'eliminate',
        meta:{
          title:'消除',
          auth:false
        },
        component:()=>import("@/views/games/eliminate/eliminate.vue"),
      },
      {
        path: 'snake',
        meta:{
          title:'贪吃蛇',
          auth:false
        },
        component:()=>import("@/views/games/snake/snake.vue")
      },
    ]
  },
    {
        path: '/packaging',
        meta:{
            title:'封装组件',
            auth:false
        },
        component:Layout,
        children:[
            {
                path: 'skeleton',
                meta:{
                    title:'骨架屏',
                    auth:false
                },
                component:()=>import("@/views/packaging/skeleton/skeleton.vue"),
            },
            {
              path: 'table',
              meta:{
                title:'表格',
                auth:false
              },
              component:()=>import("@/views/packaging/table/table.vue"),
            }
        ]
    },
]


// 不需要权限校验的路由
const normalRoutes:Array<RouteRecordRaw> = [
    { path: '/:pathMatch(.*)*',meta:{invisible:true,auth:false}, redirect:'/404'},
    { path: '/404',meta:{invisible:true,auth:false}, name: 'not-found', component: NotFound },
]

// 路由
export const routes:Array<RouteRecordRaw> = [
    ...requireAuthRoutes,
    ...normalRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
