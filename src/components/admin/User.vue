<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">

      <!-- 这里是， 点进来二级菜单之后 -->
             
      <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
      <!-- <el-button @click="logoutToHome" >首页</el-button> -->

      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 视图区 -->
    <el-card>
      <!-- 间隙 ,此处为按钮和搜索框间的距离-->
      <el-row :gutter="25">
        <!-- 列宽 -->
        <el-col :span="10">
          <!-- 搜索添加 v-model是将按钮提供数据绑定，@clear是将搜索栏清楚后，也要将搜出来的数据清楚 -->
            <el-input placeholder="请输入user name内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <!-- <el-input placeholder="请输入搜索内容" > -->
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
         </el-col>

         <el-col :span="10">
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addDialogVisible=true">add User</el-button>
         </el-col>

      </el-row>

      <!-- <span>{{userList}}</span> -->


      <!-- 用户列表。用于改、查 , 其中，border是边框，stripe是隔行变色 -->
      <el-table :data="userList" border stripe>
        <!--索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="用户id" prop="idUser"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="性别" prop="gender"></el-table-column>
          <el-table-column label="cellphone" prop="cellphone"></el-table-column>
          <el-table-column label="状态" prop="isAvailable"></el-table-column>
          <el-table-column label="权限" prop="state">

              <!-- 作用域插槽 ,用来绑定数据的-->
          <template slot-scope="scope">
            <!-- {{scope.row}}封装好的每一行的数据 -->
              <el-switch v-model="scope.row.state"></el-switch>
          </template>
          </el-table-column>

        
          <el-table-column label="操作" >

          <template slot-scope="scope">

            <!-- 修改 -->
                  <!-- 更改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.idUser)"></el-button>
                  <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.idUser)"></el-button>

            </template>
            
          </el-table-column>


      </el-table>

      <!-- 分页组件 size-change 每页最大的变化 current-change 当前最大变化 layout功能组件 -->
        <div>
            <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryInfo.pageNum"
                  :page-sizes="[1, 2, 5, 100]"
                  :page-size="queryInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
        </div>

    </el-card>


    <!-- 新增用户区域 -->
    <el-dialog title="add User" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
            
            
            <el-form-item label="UserName" prop="username">
                <el-input  suffix-icon="el-icon-edit" v-model="addForm.username"></el-input>
            </el-form-item>

            <el-form-item label="Password" prop="password">
                <el-input  suffix-icon="el-icon-edit" type="password" v-model="addForm.password"></el-input>
            </el-form-item>
<!-- 
            <el-form-item label="Gender" prop="gender">
                <el-input v-model="addForm.gender"></el-input>
            </el-form-item> -->

            <!-- <el-form-item label="Gender" prop="gender">
                <el-checkbox v-model="addForm.gender" :checked="true" true-label="Male">Male</el-checkbox>
                <el-checkbox v-model="addForm.gender" :checked="true" true-label="Female">Female</el-checkbox>
            </el-form-item> -->
            <el-form-item label="Gender" prop="gender">
              <el-radio-group v-model="addForm.gender">
                <el-radio label="Female"></el-radio>
                <el-radio label="Male"></el-radio>
              </el-radio-group>
            </el-form-item>


            <el-form-item label="Cellphone" prop="cellphone">
                <el-input v-model="addForm.cellphone"></el-input>
            </el-form-item>

            <el-form-item label="Family" prop="idFamily">
                <el-input v-model="addForm.idFamily"></el-input>
            </el-form-item>

        </el-form>

        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="addUser"> Submit</el-button>
            
          </span>

    </el-dialog>


    <!-- 修改对话框,设定是，idUser和username都不能修改， -->
     <el-dialog title="edit User" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
            
            
            <el-form-item label="UserName" prop="username">
                <el-input  suffix-icon="el-icon-edit" v-model="editForm.username" disabled></el-input>
            </el-form-item>

            <!-- <el-form-item label="Password" prop="password">
                <el-input  suffix-icon="el-icon-edit" type="password" v-model="editForm.password"></el-input>
            </el-form-item> -->



            <el-form-item label="Cellphone" prop="cellphone">
                <el-input v-model="editForm.cellphone"></el-input>
            </el-form-item>

            <el-form-item label="Family" prop="idFamily">
                <el-input v-model="editForm.idFamily"></el-input>
            </el-form-item>

        </el-form>

        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="editUserInfo"> Submit</el-button>
            
          </span>

    </el-dialog>

  </div>
</template>
<script>
export default {
  
    created(){
      this.getUserList();
    },
    data(){
      return {

      // 查询信息的实体
          queryInfo:{
              query:"",//查询信息
              pageNum:1,//当前页
              pageSize:5//每页的最大数
          },

          userList:[],//用户列表

          total:0,//最大的记录的数量，
          addDialogVisible:false,//添加用户的对话框的显示或隐藏
          addForm:{
            username:'',
            password:'',
            gender:'',
            cellphone:'',
            idFamily:'',
          },//在这里拿输入的信息
          // 修改用户的信息：
          editForm:{},
          // 页面的显示和隐藏，修改用户栏
          editDialogVisible:false,
          // 表单验证
          addFormRules:{
              username:[
                {required:true,message:'请输User name',trigger:'blur'},
                {min:5,max:8,message:'请在5-8个长度',trigger:'blur'},
              ],
              password:[
                    {required:true,message:'请输入password',trigger:'blur'},
                {pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{5,8}$/,message:'包含大写、小写、数字且长度为5-8'},
                {min:5,max:8,message:'请在5-8个长度',trigger:'blur'},

              ],
              gender:[
                  {required:true,message:'请选择gender'},
                  // {min:4,max:4,message:''}
              ],
              cellphone:[
                {required:true,message:'请输入cellphone',trigger:'blur'},
                {min:11,max:11,message:'请输入11位',trigger:'blur'}
              ],
              idFamily:[
                  {required:true,message:'请输入3位家庭id',trigger:'blur'},
                  {min:3,max:3,message:"请输入3位",trigger:'blur'},
                  // {pattern:/^(?=.*[0-9])(?=.*[0-9])(?=.*\d)[^]{3}$/},
                  {pattern:/^[0-9]*$/, message:'请输入3位数字'}
              ],
          },
          editFormRules:{
              // username:[
              //   {required:true,message:'请输User name',trigger:'blur'},
              //   {min:5,max:8,message:'请在5-8个长度',trigger:'blur'},
              // ],
              // password:[
              //       {required:true,message:'请输入password',trigger:'blur'},
              //   {pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{5,8}$/,message:'包含大写、小写、数字且长度为5-8'},
              //  {min:5,max:8,message:'请在5-8个长度',trigger:'blur'},

              // ],
              gender:[
                  {required:true,message:'请选择gender'},
                  // {min:4,max:4,message:''}
              ],
              cellphone:[
                {required:true,message:'请输入cellphone',trigger:'blur'},
                {min:11,max:11,message:'请输入11位',trigger:'blur'}
              ],
              idFamily:[
                  {required:true,message:'请输入3位家庭id',trigger:'blur'},
                  {min:3,max:3,message:"请输入3位",trigger:'blur'},
                  // {pattern:/^(?=.*[0-9])(?=.*[0-9])(?=.*\d)[^]{3}$/},
                  {pattern:/^[0-9]*$/, message:'请输入3位数字'}
              ],
          },
      }
    },
    methods:{
      // 获取所有用户
      async getUserList(){
          // console.log(123);
          // 创建了data类型的res，data类型在上面定义了，就是有queryInfo，还有userList，还有total
          const {data:res}=await this.$http.get("getUserInfo",{params:this.queryInfo});
          console.log(res);
          console.log("total " +res.number);
          console.log("data  "+res.result);
          this.total=res.number;

          this.userList=res.result;
          console.log("total: "+this.total);
          console.log("userList: "+this.userList);
        },
        // 当页面变化的时候
        handleSizeChange(newSize){
          this.queryInfo.pageSize=newSize;
          // 调用getUserList,将userList传进去
          this.getUserList();
        },
        // pageNum 的触发动作
        handleCurrentChange(newPage){
            this.queryInfo.pageNum=newPage;
            this.getUserList();
        },
        // 这是清零的操作
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
       
        addUser(){

          console.log("addUser的第一个方法");
          // 如果表单的数据无效，就不能往下进行
            this.$refs.addFormRef.validate(async valid=>{
                // console.log("true");

                console.log(valid);
                // 如果没有验证成功——数据无效
              if(!valid) return ;
              console.log("到这里的？？");
              const {data:res}=await this.$http.post("addUser",this.addForm);

              console.log("res   "+res);
              if(res!="success"){
                  return this.$message.error("操作失败!!~");
              }
              this.$message.success("操作成功!!~");
              this.addDialogVisible=false;
              this.getUserList();
           });
        },
      
        // 删除事件,根据主键，删除用户
        async deleteUser(idUser){
          console.log("是idUser"+idUser); 

          // 这是信息提示框
          const confirmResult =await this.$confirm("This operation will delete the user forever, click 'Yes' to continue. ",'HINT',{
            confirmButtonText:'Yes',
            // confirmButtonText:'Cancel',
            type:'warning'
          }).catch(err=>err);   //后面这个catch是异常处理

          if(confirmResult!='confirm'){
            // 如果选择了取消
            return this.$message.info("The operation has been canceled!!!");
          }
            // 如果继续操作
            // this.$http.delete
            console.log("点击了继续");
          const {data:res}=await this.$http.delete("deleteUser?idUser="+idUser);
          // const {data:res}=await this.$http.post("deleteUser",this.idUser);


            // 看返回结果
            if(res!="success"){
              // 不成功，
              return this.$message.error('fail to delete the user!!');
            }
              console.log(res);
            this.$message.success('success to delete!! ');
            this.getUserList();

        },
        // 展示修改框
        async showEditDialog(idUser){
            console.log("this is the show 修改狂");
            console.log(idUser);
            // const {data:res}=await this.$http.get("getUpdate?idUser=",{param:idUser});
            const {data:res}=await this.$http.delete("getUpdate?idUser="+idUser);
            

            // res返回的是json串
            this.editForm=res;
            this.editDialogVisible=true;


        },
        // 修改狂清零
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },
      // 最终提交的时候submit的监听函数
        editUserInfo(){
          // 数据的格式判断
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return ;
                console.log("valid  "+valid);
                const {data:res}=await this.$http.put("editUser",this.editForm);

                if(res!="success") return this.$message.error("更改User信息失败！！！！！~~~");
                this.$message.success("成功更改个人信息！！！");
                // 隐藏
                this.editDialogVisible=false;
                this.getUserList();
            });
        },

      //   logoutToHome(){
      //        window.sessionStorage.clear();
      // this.$router.push("/home");
          
      //   },
    }

};
</script>
<style lang="less" scoped>
</style>