<template>
    <div>
        

         <el-breadcrumb separator-class="el-icon-arrow-right">

      <!-- 这里是， 点进来二级菜单之后 -->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>Device of statistics</el-breadcrumb-item>
         </el-breadcrumb>
         
    <el-divider></el-divider>
         
    <!-- 视图区 -->
    <el-card>
      <!-- 间隙 ,此处为按钮和搜索框间的距离-->
      <el-row :gutter="30">
        <!-- 列宽 -->
        <!-- <div style="width:20%"> -->
        <el-col :span="6">
          <!-- 搜索添加 v-model是将按钮提供数据绑定，@clear是将搜索栏清楚后，也要将搜出来的数据清楚 -->
            <el-input placeholder="请输入Device Id" v-model="queryInfo.query" clearable @clear="getDeviceList">
            <!-- <el-input placeholder="请输入搜索内容" > -->
              <el-button slot="append" icon="el-icon-search" @click="getDeviceList"></el-button>
            </el-input>
         </el-col>
        <!-- </div> -->
        
        <!-- 时间的选择 -->
        <el-col :span="9">
            <!-- <div class="block" > -->
                <el-date-picker
                v-model="queryInfo.date"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00', '08:00:00']">
                </el-date-picker>
<!-- 
                <el-time-picker
                  is-range
                  v-model="queryInfo.time"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
               </el-time-picker>  -->
            <!-- </div> -->
        </el-col>

         <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="searchClick">search</el-button>
         </el-col>

         <el-col :span="2">
            <el-button type="info" icon="el-icon-refresh" @click="searchDeClick">clear</el-button>
         </el-col>

      </el-row>

      <!-- <span>{{userList}}</span> -->


      <!-- 用户列表。用于改、查 , 其中，border是边框，stripe是隔行变色 -->
      <el-table :data="deviceList" border stripe>
        <!--索引列 -->
          <el-table-column type="index"></el-table-column>

          <!-- 注意顺序,select 的时候不要* 并且 -->
          <el-table-column label="idDevice" prop="idDevice"></el-table-column>
          <el-table-column label="CategoryName" prop="categoryName"></el-table-column>

          <el-table-column label="Value" prop="status"></el-table-column>
          <!-- <el-table-column label="Price" prop="price"></el-table-column> -->
          <el-table-column label="Date" prop="date"></el-table-column>
          <el-table-column label="Time" prop="time"></el-table-column>
          <el-table-column label="idFamily" prop="idFamily"></el-table-column>



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


         
    </div>
</template>

<script>
export default{
     created(){
      this.getDeviceList();
    },
    data(){
        return {
             // 查询信息的实体
          queryInfo:{
              query:"",//查询信息
              pageNum:1,//当前页
              pageSize:5,//每页的最大数
              date:["2020-05-01 00:00:00","2021-09-21 08:00:00"],//"yyyy-MM-dd HH:mm:ss"
              // time:"",
          },


          deviceList:[],//用户列表

          total:0,//最大的记录的数量，
        //   addDialogVisible:false,//添加用户的对话框的显示或隐藏
        };
    },
    methods:{

        async getDeviceList(){
  				// var data = new URLSearchParams();
          // data.append("query",this.queryInfo.query);
          // data.append("pageNum",this.queryInfo.pageNum);
          // date.append("pageSize",this.queryInfo.pageSize);
          // date.append("pageSize",this.queryInfo.pageSize);
          // data.append("startDate",this.queryInfo.date[0]||'');
          // data.append("endDate",this.queryInfo.date[1]||'');

          // console.log("data    !!!  "+data);




            console.log("get device list!!!");
            // const {data:res}=await this.$http.get("getDeviceInfo",{params:this.queryInfo});
            console.log(this.queryInfo);
            
            // const {data:res}=await this.$http.get("getRecordDevice",{params:data});

            // const {data:res}=await this.$http.get("getRecordDevice",{params:this.queryInfo});
            const {data: res}=await this.$http.post("getRecordDevice",this.queryInfo);
            // const {data: res}=await this.$http.post("getRecordDevice",data);

            console.log(res);
            // console.log("total:  "+res.number);
            // console.log("data  "+res.result);
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
          // var data = new URLSearchParams();
          // data.append("query",this.queryInfo.query);
          // data.append("pageNum",this.queryInfo.pageNum);
          // date.append("pageSize",this.queryInfo.pageSize);
          // date.append("pageSize",this.queryInfo.pageSize);
          // data.append("startDate",this.queryInfo.date[0]||'');
          // data.append("endDate",this.queryInfo.date[1]||'');

          // console.log("data    !!!  "+data);
          
          //   const {data: res}=await this.$http.post("getRecordDevice",data);
          
            console.log(this.queryInfo);
            console.log("searchClick");
            console.log("this.queryInfo"+this.queryInfo.query+"    queryInfo  "+this.queryInfo.date);
            console.log("why why why!!!");
            // const {data:res}=await this.$http.get("getRecordDevice",{params:this.queryInfo});
            console.log("-0-----------");

            const {data: res}=await this.$http.post("getRecordDevice",this.queryInfo);
            
            this.total=res.number;
            this.deviceList=res.result;
            console.log("total   ",res.number);
            console.log("device  ",res.result);

            if(res!="success"){
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
        
    },
}
</script>

<style  scoped>

</style>