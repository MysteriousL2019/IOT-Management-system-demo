<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 这里是， 点进来二级菜单之后 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Device into two parts </el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <el-container>
      <el-header>
        <el-row :gutter="25">
          <!-- <el-form ref="form" :model="form" label-width="80px">
                </el-form> -->
          <el-col :span="5">
            <el-input
              placeholder="请输入Device Id"
              :rules="checkInputId"
              prop="InputId"
              v-model="queryInfo.query"
              clearable
              @clear="getDeviceList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                prop="InputId"
                @click="getDeviceList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input
              placeholder="请输入0-100的数字"
              :rules="checkInputRange"
              prop="InputNumber"
              v-model="queryInfo.dividePoint"
              clearable
              @clear="getDeviceList"
            >
              <el-button
                slot="append"
                icon="el-icon-data-line"
                prop="InputNumber"
              ></el-button>
            </el-input>
          </el-col>

          <el-col :span="7">
            <el-date-picker
              v-model="queryInfo.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            >
            </el-date-picker>
          </el-col>

          <el-col :span="2">
            <el-button type="primary" icon="el-icon-search" @click="searchClick"
              >search</el-button
            >
          </el-col>

          <el-col :span="2">
            <el-button type="info" icon="el-icon-refresh" @click="searchDeClick"
              >clear</el-button
            >
          </el-col>
        </el-row>
            <el-divider></el-divider>

      </el-header>
      <el-container>
        <el-aside width="800px">
          <el-cards>
              <br>
            <el-row :gutter="25"> </el-row>

            <!-- <br> -->
               <el-row>
                 <div class="pie1">
                  <div id="pie1" style="width: 800px; height: 90%">
                    asdasdasda!!!
                  </div>
              </div>
            </el-row>
            <el-divider></el-divider>

            <el-row>
              <el-col>
                <div class="mainChart" style="color: '#fff'">
                  <div id="mainChart" style="width: 850px; height: 90%">
                    <div style="font-size: 16px;">
                    This is the area to show the statistics
                    </div>
                    <!-- asdas -->
                  </div>
                </div>
              </el-col>
            </el-row>
            <br />
         
            <el-divider></el-divider>
          </el-cards>
        </el-aside>

        <el-main>
          <el-card>
          <!--  <el-row>
              <el-col :span="3"> test </el-col>
              <el-col :span="1"> tt </el-col>
              <el-col :span="20">
                <div class="pie1">
                  <div id="pie1" style="width: 70%; height: 90%">
                    asdasdasda!!!
                  </div>
                </div>
              </el-col>
            </el-row> -->
            <!-- <span>{{userList}}</span> -->

            <!-- 用户列表。用于改、查 , 其中，border是边框，stripe是隔行变色 -->
            <el-table :data="deviceList" border stripe>
              <!--索引列 -->
              <el-table-column type="index"></el-table-column>

              <!-- 注意顺序,select 的时候不要* 并且 -->
              <el-table-column
                label="idDevice"
                prop="idDevice"
              ></el-table-column>
              <el-table-column
                label="CategoryName"
                prop="categoryName"
              ></el-table-column>

              <el-table-column label="Value" prop="status"></el-table-column>
              <!-- <el-table-column label="Price" prop="price"></el-table-column> -->
              <el-table-column label="Date" prop="date"></el-table-column>
              <el-table-column label="Time" prop="time"></el-table-column>
              <!-- <el-table-column label="idFamily" prop="idFamily"></el-table-column> -->
            </el-table>

            <!-- 分页组件 size-change 每页最大的变化 current-change 当前最大变化 layout功能组件 -->
            <div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[15, 50,100]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导入一个charts
var echarts = require("echarts");

export default {
  created() {
    this.getDeviceList();
    this.useEchart();

  },
  data() {
    return {
      // 查询信息的实体
      queryInfo: {
        query: "", //查询信息
        pageNum: 1, //当前页
        pageSize: 15, //每页的最大数
        date: ["2020-05-01 00:00:00", "2021-09-21 08:00:00"], //"yyyy-MM-dd HH:mm:ss"
        dividePoint: "",
      },
      checkInputId: {
        InputId: [
          { required: true, message: "请输Device id", trigger: "blur" },
          { min: 3, max: 3, message: "请在3个长度", trigger: "blur" },
        ],
      },
      checkInputRange: {
        InputNumber: [
          { required: true, message: "请输入数字", trigger: "blur" },
          { min: 2, max: 2, message: "请在3个长度", trigger: "blur" },
          { pattern: /^[0-100]/, message: "0-100数" },
        ],
      },

      deviceList: [], //用户列表

      total: 0, //最大的记录的数量，
      //   addDialogVisible:false,//添加用户的对话框的显示或隐藏
    };
  },
  mounted() {
    this.getDeviceList();
    this.useEchart();

  },
  methods: {
    async useEchart() {
      // 获取数据
      const { data: res } = await this.$http.post(
        "getProportion",
        this.queryInfo
      );
      console.log("----------------------------------------------------------");
      console.log(res);
      console.log("----------------------------------------------------------");
      // 初始化图表格
      var myChart = echarts.init(document.getElementById("pie1"));

      // 配置表格的数据Option
      var option = {
        title: {
                text: 'Proportion of all Device',
                // subtext: 'What users care most about voice assistants around the world',
                left: 'center',
                textStyle: { color: "#000" },

            },
        tooltip: {
          // trigger: 'item'
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#000",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: res.number1, name: "humidifier" },
              { value: res.number2, name: "lamp" },
              { value: res.number3, name: "door" },
              { value: res.number4, name: "window" },

            ],
          },
        ],
      };
      myChart.setOption(option);
      // myChart.setOption(option);

      // setOption
    },
    async getDeviceList() {
      console.log("get device list!!!");
      console.log(this.queryInfo);

      const { data: res } = await this.$http.post(
        "getRecordDevice",
        this.queryInfo
      );

      console.log(res);
      this.total = res.number;
      this.deviceList = res.result;
      console.log("total: " + this.total);
      console.log("Device List  " + this.deviceList);
    },

    // 当页面变化的时候
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      // 调用getUserList,将userList传进去
      this.getDeviceList();
    },
    // pageNum 的触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getDeviceList();
    },

    async searchClick() {
      console.log("--------------------------------------");
      console.log(this.queryInfo);
      console.log("--------------------------------------");

      console.log("searchClick");
      console.log(
        "this.queryInfo" +
          this.queryInfo.query +
          "    queryInfo  " +
          this.queryInfo.date
      );
      console.log("why why why!!!");
      // const {data:res}=await this.$http.get("getRecordDevice",{params:this.queryInfo});
      console.log("-0-----------");

      const { data: res } = await this.$http.post(
        "getRecordByPoint",
        this.queryInfo
      );

      console.log("-----------------------------");
      console.log("!!! " + this.queryInfo.query);
      console.log("CompareToInputValue0", res.CompareToInputValue0);
      console.log("CompareToInputValue1", res.CompareToInputValue1);
      console.log("CompareToInputValue2", res.CompareToInputValue2);

      console.log("-----------------------------");

      if (
        res.CompareToInputValue0 == 0 &&
        res.CompareToInputValue1 == 0 &&
        res.CompareToInputValue2 == 0
      ) {
        return this.$message.error("操作失败!!~");
      }
      this.$message.success("操作成功!!~");
      var myChart = echarts.init(document.getElementById("mainChart"));
      // var buildLine=this.$echarts.init(document.getElementById("buildLine"));
      var xData = [];
      var yData = [];
      xData.push("lower than " + this.queryInfo.dividePoint);
      xData.push("equals to " + this.queryInfo.dividePoint);
      xData.push("higher than " + this.queryInfo.dividePoint);
      yData.push(res.CompareToInputValue0);
      yData.push(res.CompareToInputValue1);
      yData.push(res.CompareToInputValue2);
      console.log("********************************************");
      console.log(xData, yData);
      console.log("********************************************");
      var option2 = {
        title: {
          text: "Report of " + res.kind + " between " + this.queryInfo.date,
          // subtext: 'What users care most about voice assistants around the world',
          left: "center",

          textStyle: { color: "#000" },
        },
        tooltip: {},
        legend: {
          data: ["" + res.kind],
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#000",
          },
        },
        xAxis: {
          type: "category",
          data: xData,
          color: "#000",
          axisLabel: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是为了突出显示加上的
            },
            borderWidth: 10,
          },
        },
        yAxis: {
          // type: 'value',
          // color:'#000',
          axisLine: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是为了突出显示加上的
            },
          },
          // data:yData
        },
        series: [
          {
            name: "" + res.kind,
            data: yData,
            type: "line",
            // color:'#FFFDFE',
            color: "#000",

            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#00FFFF" },
              { offset: 0.2, color: "#00FFFF" },
              { offset: 1, color: "rgba(20,200,212,0)" },
            ]),
            areaStyle: {},
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      };
      myChart.setOption(option2);
      // this.drawLine();
    },

    async drawLine() {
      var mainChart = this.$echarts.init(document.getElementById("mainChart"));
      var xData = [];
      var yData = [];
      xData.push("lower than" + this.queryInfo.query);
      xData.push("equals to" + this.queryInfo.query);
      xData.push("higher than" + this.queryInfo.query);
      yData.push(res.CompareToInputValue0);
      yData.push(res.CompareToInputValue1);
      yData.push(res.CompareToInputValue2);
      console.log("********************************************");
      console.log(xData, yData);
      console.log("********************************************");
    },
    searchDeClick() {
      (this.queryInfo = {
        query: "",
        pageNum: 1,
        pageSize: 5,
        date: "",
      }),
        this.getDeviceList();
      console.log("llllll");
    },
  },
};
</script>

<style  scoped>
.pie1,
.pie3,
.pie6,
.mainChart {
  padding-top: 20px;
  width: 97%;
  height: 400px;
  background-color: #fff;
}
</style>