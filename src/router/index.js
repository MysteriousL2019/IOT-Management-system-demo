import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import success from '../components/Success.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/admin/User.vue'
import HomeFactory from '../components/HomeFactory.vue'
import Device from '../components/admin/Device.vue'
import Category from '../components/admin/Category.vue'
import Family from '../components/admin/Family.vue'
import typeOfDevice from '../components/Records/typeOfDevice.vue'
import typeOfCategory from '../components/Records/typeOfCategory.vue'
import typeOfFamily from '../components/Records/typeOfFamily.vue'
import informationOfFamilies from '../components/Records/informationOfFamilies.vue'
import countByTwo from '../components/Records/countByTwo.vue'
import numberOfDistribute from '../components/Records/numberOfDistribute.vue'
import factory from '../components/Factory/factory.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/success',

    // 这里是上面引入的时候import 起的别名
    component: success
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 重定向到welcome页面
    redirect: '/welcome',
    children: [
      { path:'/welcome', component: Welcome},
      { path:'/user', component: User},
      {path:'/device',component:Device},
      {path:'/category',component:Category},
      {path:'/family',component:Family},
      {path:'/typeOfFamily',component:typeOfFamily},
      {path:'/typeOfCategory',component:typeOfCategory},
      {path:'/typeOfDevice',component:typeOfDevice},
      { path: '/informationOfFamilies', component: informationOfFamilies},
      { path: '/countByTwo', component: countByTwo},
      { path: '/numberOfDistribute', component: numberOfDistribute},
    ],
  },
  {
    path:'/homeFactory',
    component: HomeFactory,
    // redirect:'/welcome',
    children:[
      { path: '/factory', component: factory },
    ],
  },
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫——从哪里发出的请求，请求到哪里，和之后要做的，这里是用于“安全退出的时候，清楚相应的数据”
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪里访问的路径
  // next:之后要做的任务，是一个函数
  //    next（）放行， next（'/URL'）强制跳转的路径。
  if (to.path == '/login') return next();// 访问路径为登录，——如果想要访问首页，就放行（不这样写，当访问首页的时候，会形成死循环）
  // 获取flag
  const flagStr = window.sessionStorage.getItem("flag");// session取值
  if (!flagStr) return next('/login');// 没登录去登录，如果没有值，就会跳转到login界面，
  next();
})

export default router// 暴露出去
