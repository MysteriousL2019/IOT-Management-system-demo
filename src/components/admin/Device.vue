<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">

      <!-- 这里是， 点进来二级菜单之后 -->
             
      <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
      <!-- <el-button @click="logoutToHome" >首页</el-button> -->

      <el-breadcrumb-item>设备列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>


    <!-- 视图区 -->
    <el-card>
      <!-- 间隙 ,此处为按钮和搜索框间的距离-->
      <el-row :gutter="25">
        <!-- 列宽 -->
        <el-col :span="10">
          <!-- 搜索添加 v-model是将按钮提供数据绑定，@clear是将搜索栏清楚后，也要将搜出来的数据清楚 -->
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getDeviceList">
            <!-- <el-input placeholder="请输入搜索内容" > -->
              <el-button slot="append" icon="el-icon-search" @click="getDeviceList"></el-button>
            </el-input>
         </el-col>

         <el-col :span="10">
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addDialogVisible=true">add Device</el-button>
         </el-col>

      </el-row>

      <!-- <span>{{userList}}</span> -->


      <!-- 用户列表。用于改、查 , 其中，border是边框，stripe是隔行变色 -->
      <el-table :data="deviceList" border stripe>
        <!--索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="idDevice" prop="idDevice"></el-table-column>
          <el-table-column label="Description" prop="description"></el-table-column>
          <el-table-column label="price" prop="price"></el-table-column>
          <el-table-column label="idCategory" prop="idCategory"></el-table-column>
          <el-table-column label="idFactory" prop="idFactory"></el-table-column>
          <el-table-column label="idFamily" prop="idFamily"></el-table-column>

        
          <el-table-column label="Operation" >

          <template slot-scope="scope">

            <!-- 修改 -->
                  <!-- 更改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.idDevice)"></el-button>
                  <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDevice(scope.row.idDevice)"></el-button>

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
    <el-dialog title="add Device" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
            
            
            <el-form-item label="Description" prop="description">
                <el-input  suffix-icon="el-icon-edit" v-model="addForm.description"></el-input>
            </el-form-item>

            <el-form-item label="Price" prop="price">
                <el-input  suffix-icon="el-icon-edit" v-model="addForm.price"></el-input>
            </el-form-item>

             <!-- <el-form-item label="Gender" prop="gender">
              <el-radio-group v-model="addForm.gender">
                <el-radio label="Female"></el-radio>
                <el-radio label="Male"></el-radio>
              </el-radio-group>
            </el-form-item> 
 -->

             <el-form-item label="Category" prop="idCategory">
              <el-select v-model="addForm.idCategory" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item> 




            <el-form-item label="Factory" prop="idFactory">
                <el-input v-model="addForm.idFactory"></el-input>
            </el-form-item>

            <el-form-item label="Family" prop="idFamily">
                <el-input v-model="addForm.idFamily"></el-input>
            </el-form-item>

        </el-form>

        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="addDevice"> Submit</el-button>
            
          </span>

    </el-dialog>



 <!-- 修改对话框,设定是，idUser和username都不能修改， -->
     <el-dialog title="edit User" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
            
            
            <el-form-item label="Description" prop="description">
                <el-input  suffix-icon="el-icon-edit" v-model="editForm.description" ></el-input>
            </el-form-item>

            <!-- <el-form-item label="Password" prop="password">
                <el-input  suffix-icon="el-icon-edit" type="password" v-model="editForm.password"></el-input>
            </el-form-item> -->



            <el-form-item label="Price" prop="price">
                <el-input v-model="editForm.price"></el-input>
            </el-form-item>

            <el-form-item label="Category" prop="idCategory">
                <el-input v-model="editForm.idCategory" disabled></el-input>
            </el-form-item>

            <el-form-item label="Factory" prop="idFactory">
                      <el-input v-model="editForm.idFactory" disabled></el-input>
                  </el-form-item>
            
            
            <el-form-item label="Family" prop="idFamily">
                <el-input v-model="editForm.idFamily"></el-input>
            </el-form-item>

        </el-form>
        
<!-- 底部内容 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false"> Cancel</el-button>
            <el-button type="primary" @click="editDeviceInfo"> Submit</el-button>
            
          </span>

    </el-dialog>



  </div>
</template>
<script>
export default {
  
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
        },
        //  {
        //   value: '选项5',
        //   label: '北京烤鸭'
        // }
        ],

      // 查询信息的实体
          queryInfo:{
              query:"",//查询信息
              pageNum:1,//当前页
              pageSize:5//每页的最大数
          },


          deviceList:[],//用户列表

          total:0,//最大的记录的数量，
          addDialogVisible:false,//添加用户的对话框的显示或隐藏
          addForm:{
            // idDevice:'',
            description:'',
            price:'',
            idCategory:'',//注意，这里通过idCategory来获取idDevice的信息，
            idFactory:'',
            idFamily:'',
            },//在这里拿输入的信息
            editForm:{},
          editDialogVisible:false,

          // 表单验证
          addFormRules:{
              description:[
                {required:true,message:'请输Description',trigger:'blur'},
                {min:5,max:22,message:'请在5-8个长度',trigger:'blur'},
              ],
              price:[
                  {required:true,message:'请输入设备价格',trigger:'blur'},
                  {min:1,max:6,message:"请输入1-6位",trigger:'blur'},
                  // {pattern:/^(?=.*[0-9])(?=.*[0-9])(?=.*\d)[^]{3}$/},
                  {pattern:/^[0-9]*$/, message:'请输入数字'}
              ],
              idCategory:[
                  {required:true,message:'请选择设备种类'}
              ],
              idFactory:[
                  {required:true,message:'请输入设备工厂'},
                  {min:2,max:2,message:"请输入2位",trigger:'blur'},
                  {pattern:/^[0-9]*$/, message:'请输入2位数字'}
              ],
              idFamily:[
                  {required:true,message:'请输入设备家庭'},
                  {min:3,max:3,message:"请输入3位",trigger:'blur'},
                  {pattern:/^[0-9]*$/, message:'请输入3位数字'}
              ],
          },
          editFormRules:{
            description:[
                {required:true,message:'请输Description',trigger:'blur'},
                {min:5,max:22,message:'请在5-8个长度',trigger:'blur'},
              ],
               price:[
                  {required:true,message:'请输入设备价格',trigger:'blur'},
                  {min:1,max:6,message:"请输入1-6位",trigger:'blur'},
                  // {pattern:/^(?=.*[0-9])(?=.*[0-9])(?=.*\d)[^]{3}$/},
                  {pattern:/^[0-9]*$/, message:'请输入数字'}
              ],
              idFamily:[
                  {required:true,message:'请输入设备家庭'},
                  {min:3,max:3,message:"请输入3位",trigger:'blur'},
                  {pattern:/^[0-9]*$/, message:'请输入3位数字'}
              ],
          },
      }
    },
    methods:{
      // 获取所有Device
      async getDeviceList(){
          console.log("get device list!!!");
          const {data:res}=await this.$http.get("getDeviceInfo",{params:this.queryInfo});
          console.log(res);
          console.log("total:  "+res.number);
          console.log("data  "+res.result);
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
        // 这是清零的操作
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addDevice(){
            console.log("addDevice的第一个方法");
            this.$refs.addFormRef.validate(async valid=>{
              console.log(valid);
              if(!valid) return;

              console.log("没有return ");
              const {data:res} = await this.$http.post("addDevice",this.addForm);
              console.log("res "+ res);
              if(res!="success"){
                return this.$message.error("操作失败！~");
              }
              this.$message.success("操作成功!!~");
              this.addDialogVisible=false;
              this.getDeviceList();
            })
        },
        // 展示修改框
        async showEditDialog(id){
          console.log("this is the show 修改狂");
          console.log(id);

           const {data:res}=await this.$http.delete("getUpdateDevice?idDevice="+id);
            

          //   // res返回的是json串
            this.editForm=res;
            this.editDialogVisible=true;

        },
         // 修改狂清零
        editDialogClosed(){
          this.$refs.editFormRef.resetFields();
        },
        editDeviceInfo(){
          // 数据的格式判断
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return ;
                console.log("valid  "+valid);
                const {data:res}=await this.$http.put("editDevice",this.editForm);

                if(res!="success") return this.$message.error("更改User信息失败！！！！！~~~");
                this.$message.success("成功更改个人信息！！！");
                // // 隐藏
                this.editDialogVisible=false;
                this.getDeviceList();
            });
        },
 // 删除事件,根据主键，删除用户
        async deleteDevice(idDevice){
          console.log("是idDevice"+idDevice); 

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
          const {data:res}=await this.$http.delete("deleteDevice?idDevice="+idDevice);
          // const {data:res}=await this.$http.post("deleteUser",this.idUser);


            // 看返回结果
            if(res!="success"){
              // 不成功，
              return this.$message.error('fail to delete the user!!');
            }
              console.log(res);
            this.$message.success('success to delete!! ');
            this.getDeviceList();

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