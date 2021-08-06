<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!--头像-->
        <img src="../assets/logo.png" alt />
      </div>
      <!--添加表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
        label-width="0px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icondenglu"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont iconmima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin1",
        password: "123Wyx",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "密码为 6~8 位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 重置表单内容
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {

      // 提交申请请求，此处的valid是指admin和密码符合标准规范
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        // 调用get请求

        
        // const { data: res } = await this.$http.post("test");
        console.log(this.loginForm.username);
        console.log(this.loginForm.password);

        // this.loginForm是在上面封装的用户名和密码
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log("res: "+res);
        console.log("res:flag   "+res.flag);
        console.log("res user: "+res.user);



        if (res.flag == "ok1") {

          // 
          window.sessionStorage.setItem("flag", "ok1"); // session 放置
          this.$message.success("登陆成功！！！管理员端");

          // 挂载，让其加载到home页
          this.$router.push({
              path:'/home',
              query:{
                parm:res.userName
              }
          });
          // this.$router.push({ path: "/home" });
          
          console.log("我这里呢！！！！！！");
          console.log(res.user);
          console.log("!@$EE$@$%@$%!$%!$%!$!   "+res.userName);
          console.log("我这里呢！！！！！！");

        } else if(res.flag=="ok2"){

          window.sessionStorage.setItem("flag", "ok2"); // session 放置
          this.$message.success("登陆成功！！！工厂端");

          // 挂载，让其加载到home页

          // 需要传参数
          // this.$router.push({ path: "/homeFactory" });
          this.$router.push({
              // name:'/homeFactory',
              path:'/homeFactory',
              query:{
                parm:res.userName
              }
          });
          console.log("我这里呢！！！！！！");
          console.log(res.user);
          console.log("!@$EE$@$%@$%!$%!$%!$!   "+res.userName);
          console.log("我这里呢！！！！！！");
        }
        else {
          this.$message.error("登录失败！！！");
        }




        // if (res.flag == "ok") {

        //   // 
        //   window.sessionStorage.setItem("flag", "ok"); // session 放置
        //   this.$message.success("登陆成功！！！");

        //   // 挂载，让其加载到home页
        //   this.$router.push({ path: "/home" });
          
        //   console.log("我这里呢！！！！！！");
        //   console.log(res.user);
        //   console.log("我这里呢！！！！！！");

        // } else {
        //   this.$message.error("登录失败！！！");
        // }
      });
    },
  },
};
</script>

<style lang="less" scoped>
// 跟节点样式
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
// 登录框
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px; // 圆角
  position: absolute; // 绝对定位
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 根据自己位置 以自己为长度位移
  // 头像框
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%; // 加圆角
    padding: 10px;
    box-shadow: 0 0 10px #ddd; // 盒子阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #0ee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; // 加圆角
      background-color: #eee;
    }
  }
  .btns {
    display: flex; // 弹性布局
    justify-content: flex-end; // 尾部对齐
  }
  .login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box; // 设置边框
  }
}
</style>