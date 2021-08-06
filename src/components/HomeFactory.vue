<template>
  <el-container class="home-container">
    <!--头部布局-->
    <el-header>
      <div>
        <img src="../assets/logoHome.png" alt class="logo_img" />
        <span>后台管理系统</span>
      </div>


      <el-dropdown @command="handleCommand">
      <span class="test1">
          {{this.parm? `Hello, ${this.parm}`:'未登录'}}  
          <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="" icon="el-icon-switch-button" class="test">Logout</el-dropdown-item>
        
      </el-dropdown-menu>
    </el-dropdown>
      
      
      <!-- <el-button type="info" @click="logout" icon="el-icon-close">安全退出</el-button> -->
    </el-header>
    <el-container>
      <!--侧边布局，如果转轴打开就是200px，没有则是64px-->
      <el-aside :width="isCollapse ?'64px':'400px'">
        <!--伸缩按钮-->

        <div class="toggle-button" @click="toggleCollapase" icon="el-icon-s">|||</div>
        <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由 active-text-color 颜色-->
        
        <!-- 现在好像没用？？是因为读到数据之后，才开始构造左侧的，unique-opened是仅仅能一个打开的菜单 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" 
          :collapse-transition="false"  :router="true" :default-active="activePath">
        

      <!-- 这里的index和上面的:router="true"配合，将子目录加上跳转 -->


      <el-menu-item index=""
      @click="goToDevice()"
       >
        <i class="el-icon-s-platform"></i>
        <span slot="title">Device</span>
      </el-menu-item>


        </el-menu> 


      </el-aside>
      <!--主体布局-->
      <el-main>
        
        this is main!!!

          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    data() {
        return {
            // 左侧菜单，创建一个左侧菜单的列表
            menuList: [],
            iconsObject: {
              // 这边是加几个icon，就是在elementUI中的
              '100':'iconfont iconguanliyuan',
              '200':'iconfont iconsport',
              '101':'iconfont icondenglu',
              '102':'iconfont iconmima',
              '103':'iconfont iconsport',
              '104':'iconfont iconshangpin',
              '201':'iconfont iconshu',
              '202':'iconfont iconkaluli',
              '203':'iconfont iconshiwu',
              '204':'iconfont icondenglu',
            },
            isCollapse:false,
            // 被激活的连接
            activePath:'',
            parm:'',
        }
    },
  // 类似onload
  created() {
      this.parm=this.$route.query.parm;
      console.log("res 的admin  "+this.parm);
      this.getMenuList();
      // 这里是防止刷新将页面选择弄没了，左侧的展开栏
      this.activePath = window.sessionStorage.getItem('activePath');// 取出session里的访问路径
  },
  methods: {
     handleCommand(command) {
        this.$message('click on logout ' + command);
        console.log("zheli1");
          this.logout();
      },
    logout() {

      // 清楚session，将用户信息清楚，类似于cookie.remove
      window.sessionStorage.clear();
      // 跳转页面
      this.$router.push("/login");
    },
    // 获取所有的导航菜单,async是为了处理，和解析整个数据menus，仅仅用this.$http.get("menus")
    async getMenuList(){
      const {data:res} = await this.$http.get("menus");//ajax的封装版，在java中获取
      console.log("————————————————————————————————————————————————————————————————————————");
      console.log(res);
      console.log("res 的admin  "+this.$parent.res.userName);
      console.log("————————————————————————————————————————————————————————————————————————");

      console.log("测试getMenulist");
      if( res.flag != 200) return this.$message.error("操作失败！！！");

      // 这里的res.Menus结构都是在后台定义的，要是不确定可以直接去看，并且在console.log中，打印出的res里面也可以看到
      this.menuList = res.Menus;
    },
    // 切换菜单折叠与展开
    toggleCollapase(){
      this.isCollapse = !this.isCollapse;
    },
    // 保存二级菜单的路径
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);// 存放点击的二级菜单
      this.activePath = activePath;// 给点击的菜单添加高亮
    },
    goToDevice(){
      console.log("成功啦！！Hkahsdahsdjkhasdahsd");
        this.$router.push({
            path:"/factory",
            query:{
                parm:this.parm,
            },
          }
          )
    },
  }
};
</script>
<style lang="less" scoped>
// 头部样式
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;// 左右贴边
  padding-left: 0%;// 左边界
  align-items: center;// 水平
  color: #fff;
  font-size: 20px;
  // 加上头部样式div的布局
  > div { //左侧div加布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
//侧边栏的样式
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;// 对其右边框
  }
}
// 中间的样式
.el-main {
  background-color: #eaedf1;
}

// 整个布局器的样式，填充满
.home-container {
  height: 100%;
}
.logo_img {
  width: 20%;
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color:#4A5064;
  font-size: 10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;// 显示鼠标指针为：小手
}

.test{
  color:#000;
}

.test1{
  color:#fff;
}
</style>