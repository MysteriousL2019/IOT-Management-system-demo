<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">

      <!-- 这里是， 点进来二级菜单之后 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>家庭列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-divider></el-divider>


    <el-card>
      <!-- 间隙 ,此处为按钮和搜索框间的距离-->
      <el-row :gutter="25">
        <!-- 列宽 -->
        <el-col :span="10">
          <!-- 搜索添加 v-model是将按钮提供数据绑定，@clear是将搜索栏清楚后，也要将搜出来的数据清楚 -->
            <el-input placeholder="请输入idFamily" v-model="queryInfo.query" clearable @clear="getFamilyList">
            <!-- <el-input placeholder="请输入搜索内容" > -->
              <el-button slot="append" icon="el-icon-search" @click="getFamilyList"></el-button>
            </el-input>
         </el-col>

         <el-col :span="10">
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addDialogVisible=true">add Family</el-button>
         </el-col>

      </el-row>

      <!-- <span>{{userList}}</span> -->


      <!-- 用户列表。用于改、查 , 其中，border是边框，stripe是隔行变色 -->
      <el-table :data="familyList" border stripe>
        <!--索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="idFamily" prop="idFamily"></el-table-column>
          <el-table-column label="Postcode" prop="postcode"></el-table-column>
          <el-table-column label="Phone" prop="phone"></el-table-column>
          <el-table-column label="City" prop="city"></el-table-column>
          <el-table-column label="Country" prop="country"></el-table-column>
          <!-- <el-table-column label="权限" prop="isAvailable"> -->

     
        
          <el-table-column label="操作" >

          <template slot-scope="scope">

            <!-- 修改 -->
                  <!-- 更改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.idFamily)"></el-button>
                  <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFamily(scope.row.idFamily)"></el-button>

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



          <el-dialog title="add Family" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
            
            
            <el-form-item label="Postcode" prop="postcode">
                <el-input  suffix-icon="el-icon-edit" v-model="addForm.postcode"></el-input>
            </el-form-item>

            <el-form-item label="Phone" prop="phone">
                <el-input  suffix-icon="el-icon-edit"  v-model="addForm.phone"></el-input>
            </el-form-item>
<!-- 
            <el-form-item label="Gender" prop="gender">
                <el-input v-model="addForm.gender"></el-input>
            </el-form-item> -->

            <!-- <el-form-item label="Gender" prop="gender">
                <el-checkbox v-model="addForm.gender" :checked="true" true-label="Male">Male</el-checkbox>
                <el-checkbox v-model="addForm.gender" :checked="true" true-label="Female">Female</el-checkbox>
            </el-form-item> -->
            <el-form-item label="City" prop="city">
                <el-input suffix-icon="el-icon-edit" v-model="addForm.city"></el-input>
            </el-form-item>


            <el-form-item label="Country" prop="country">
                <el-input suffix-icon="el-icon-edit" v-model="addForm.country"></el-input>
            </el-form-item>

        </el-form>

        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="addFamily"> Submit</el-button>
            
          </span>

    </el-dialog>


  <!-- 修改对话框,设定是，idUser和username都不能修改， -->
     <el-dialog title="edit User" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
            
            
            <el-form-item label="Postcode" prop="postcode">
                <el-input  suffix-icon="el-icon-edit" v-model="editForm.postcode"></el-input>
            </el-form-item>

            <!-- <el-form-item label="Password" prop="password">
                <el-input  suffix-icon="el-icon-edit" type="password" v-model="editForm.password"></el-input>
            </el-form-item> -->



            <el-form-item label="Phone" prop="phone">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>

            <el-form-item label="City" prop="city">
                <el-input suffix-icon="el-icon-edit" v-model="editForm.city"></el-input>
            </el-form-item>


            <el-form-item label="Country" prop="country">
                <el-input suffix-icon="el-icon-edit" v-model="editForm.country"></el-input>
            </el-form-item>

        </el-form>

        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="editFamilyInfo"> Submit</el-button>
            
          </span>

    </el-dialog>



        </div>

    </el-card>


  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 5
      },
      familyList: [],// 用户列表
     
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加用户表单项
      addForm: {
        postcode:'',
        phone:'',
        city:'',
        country:'',

      }, 
      // 控制修改用户对话框显示/隐藏
      editDialogVisible:false,
      // 修改用户信息
      editForm:{},
      // 验证规则
      addFormRules:{
        postcode:[
           { required: true, message: "请输入postcode", trigger: "blur" },
          // { min: 0, max: 10, message: "长度在 0 到 10 个字符", trigger: "blur" }
        ],
        phone:[
           { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" }
        ],
        country:[
           { required: true, message: "请输入country", trigger: "blur" },
          { min: 0, max: 50, message: "请输入正确邮箱地址", trigger: "blur" }
        ],
        city:[
           { required: true, message: "请输入city", trigger: "blur" },
          { min: 0, max: 50, message: "请输", trigger: "blur" }
        ],
      },
      // 修改用户表单验证规则
      editFormRules:{
         phone:[
           { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" }
        ],
        country:[
           { required: true, message: "请输入country", trigger: "blur" },
          { min: 0, max: 50, message: "请输入正确邮箱地址", trigger: "blur" }
        ],
        city:[
           { required: true, message: "请输入city", trigger: "blur" },
          { min: 0, max: 50, message: "请输", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getFamilyList();
  },
  methods: {
    async getFamilyList() {
      // 调用post请求
      const { data: res } = await this.$http.get("getFamilyInfo", {
        params: this.queryInfo
      });
      this.familyList = res.result; // 将返回数据赋值
      this.total = res.number; // 总个数
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getFamilyList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getFamilyList(); // 数据发生改变重新申请数据
    },
    // 修改用户状态
    // async userStateChanged(userinfo) {
    //   const { data: res } = await this.$http.put(
    //     `userState?id=${userinfo.id}&state=${userinfo.state}`
    //   );
    //   if (res != "success") {
    //     userinfo.state = !userinfo.state;
    //     return this.$message.error("操作失败！！！");
    //   }
    //   this.$message.success("操作成功！！！");
    // },
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    // 添加用户
    addFamily(){
        this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addFamily",this.addForm);
        if (res != "success") {
        return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getFamilyList();
      })
    },
    // 展示修改框
    async showEditDialog(id){
       
        const {data:res} = await this.$http.delete("getUpdateFamily?idFamily="+id);
        // if (res != "success") {
        // userinfo.state = !userinfo.state;
        // return this.$message.error("操作失败！！！");
        // }
        // this.$message.success("操作成功！！！");

        this.editForm = res;
        this.editDialogVisible = true;
    },
    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 确认修改
    editFamilyInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.put("editFamily",this.editForm);
        console.log(res);
         if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getFamilyList();
      });
    },
    // 删除按钮
    async deleteFamily(id){
      // 弹框
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!='confirm'){
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete("deleteFamily?idFamily="+id);
      if (res != "success") {
        return this.$message.error("操作失败！！！");
      }
      this.$message.success("操作成功！！！");
      this.getFamilyList();
    },
  }
};
</script>
<style lang="less" scoped>
</style>