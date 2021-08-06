<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">

      <!-- 这里是， 点进来二级菜单之后 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>种类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

  <el-card>
        <el-row :gutter="30">
            <!-- <el-col :span="4">
                <el-select v-model="queryInfo.query" filterable clearable placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>

                </el-select>

            </el-col>
 -->



           <!-- <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="searchClick">search</el-button>
         </el-col>

         <el-col :span="2">
            <el-button type="info" icon="el-icon-refresh" @click="searchDeClick">clear</el-button>
         </el-col> -->



         <el-col :span="10">
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addDialogVisible=true">add Category</el-button>
         </el-col>
        </el-row>


         <el-table :data="deviceList" border stripe>
        <!--索引列 -->
          <el-table-column type="index"></el-table-column>

          <!-- 注意顺序,select 的时候不要* 并且 -->
          <el-table-column label="CategoryName" prop="categoryName"></el-table-column>
          <el-table-column label="idCategory" prop="idCategory"></el-table-column>
       
                  <!-- 删除 -->

          <el-table-column label="操作" >

          <template slot-scope="scope">

            <!-- 修改 -->
                  <!-- 更改 -->
       <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.idCategory)"></el-button>
                  <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategory(scope.row.idCategory)"></el-button>

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




          <el-dialog title="add Category" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="125px">
            
            
              <el-form-item label="categoryName" prop="categoryName">
                  <el-input  suffix-icon="el-icon-edit" v-model="addForm.categoryName"></el-input>
              </el-form-item>

        </el-form>

        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="addCategory"> Submit</el-button>
            
          </span>

    </el-dialog>






                <el-dialog title="edit Category" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="125px">
                      
                      
                      
                      <el-form-item label="idCategory" prop="idCategory">
                          <el-input v-model="editForm.idCategory" disabled></el-input>
                      </el-form-item>


                      <el-form-item label="categoryName" prop="categoryName">
                          <el-input  suffix-icon="el-icon-edit" v-model="editForm.categoryName" ></el-input>
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
export default{
     created(){
      this.getDeviceList();
    },
    data(){
        return {

        options: [{
          value: '1',
          label: 'humidifier'
        }, {
          value: '2',
          label: 'lamp'
        }, {
          value: '3',
          label: 'door'
        }, {
          value: '4',
          label: 'window'
        }],

             // 查询信息的实体
          queryInfo:{
              query:"",//查询信息
              pageNum:1,//当前页
              pageSize:5,//每页的最大数
              // time:"",
          },


          deviceList:[],//用户列表

          total:0,//最大的记录的数量，
          addDialogVisible:false,//添加用户的对话框的显示或隐藏
             // 添加用户表单项
          addForm: {
              categoryName:'',
          }, 
          editDialogVisible:false,
          // 修改用户信息
          editForm:{},
          // 验证规则
          addFormRules:{
            categoryName:[
              { required: true, message: "请输入CategoryName", trigger: "blur" },
              { min: 0, max: 10, message: "长度在 0 到 10 个字符", trigger: "blur" }
            ],
          },
          // 修改用户表单验证规则
          editFormRules:{
            categoryName:[
              { required: true, message: "请输入CategoryName", trigger: "blur" },
              { min: 0, max: 10, message: "长度在 0 到 10 个字符", trigger: "blur" }
            ],
          },
        };
    },
    methods:{

        async getDeviceList(){
  		
            console.log("get device list!!!");
            // const {data:res}=await this.$http.get("getDeviceInfo",{params:this.queryInfo});
            console.log(this.queryInfo);
            

            const {data: res}=await this.$http.post("getAllCategoty",this.queryInfo);

            console.log(res);

            this.total=res.number;
            this.deviceList=res.result;
            console.log("total: "+this.total);
            console.log("Device List  "+this.deviceList);
        },

  // 当页面变化的时候
        handleSizeChange(newSize){
          this.queryInfo.pageSize=newSize;
          // 调用getUserList,将userList传进去
          this.getDeviceList();
        },
        // pageNum 的触发动作
        handleCurrentChange(newPage){
            this.queryInfo.pageNum=newPage;
            this.getDeviceList();
        },

        async searchClick(){
   
            console.log(this.queryInfo);
            console.log("searchClick");
            console.log("this.queryInfo "+this.queryInfo.query+"    queryInfo ");
            console.log("why why why!!!");
            console.log("-0-----------");

            const {data: res}=await this.$http.post("getAllCategory",this.queryInfo);
            
            this.total=res.number;
            this.deviceList=res.result;
            console.log("total   ",res.number);
            console.log("device  ",res.result);

            if(res.number==0){
                  return this.$message.error("操作失败!!~");
            }
            this.$message.success("操作成功!!~");
            
            

        },

        searchDeClick(){
            this.queryInfo={
              query:"",
              pageNum:1,
              pageSize:5,
              date:'',
            },
            this.getDeviceList();
            console.log("llllll");
        },
        addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    // 添加用户
    addCategory(){
        this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addCategory",this.addForm);
        if (res != "success") {
        return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getDeviceList();
      })
    },
    // 展示修改框
    async showEditDialog(id){
       
        const {data:res} = await this.$http.delete("getUpdateCategory?idCategory="+id);
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
        const {data:res} = await this.$http.put("editCategory",this.editForm);
        console.log(res);
         if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getDeviceList();
      });
    },
    // 删除按钮
    async deleteCategory(id){
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
      const {data:res} = await this.$http.delete("deleteCategory?idCategory="+id);
      if (res != "success") {
        return this.$message.error("操作失败！！！");
      }
      this.$message.success("操作成功！！！");
      this.getDeviceList();
    },
    },
}
</script>
<style lang="less" scoped>
</style>