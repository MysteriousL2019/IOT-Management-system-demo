<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 这里是， 点进来二级菜单之后 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Information of multiple families</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <el-container>
      <el-header>
        <el-row :gutter="25">
          <el-col :span="5">
            <el-input
              placeholder="0-100 split point"
              :rules="checkInputRange"
              prop="InputNumber"
              v-model="queryInfo.splitPoint1"
              clearable
              prefix-icon="el-icon-data-line"
              @clear="getDeviceList"
            ></el-input>
          </el-col>
          <el-col :span="5">
            <el-input
              placeholder="0-100 split point"
              :rules="checkInputRange"
              prop="InputNumber"
              v-model="queryInfo.splitPoint2"
              clearable
              prefix-icon="el-icon-data-line"
              @clear="getDeviceList"
            >
            </el-input>
          </el-col>
          <el-col :span="4">
                <!-- <el-radio-group v-model="queryInfo.categoryName">
                  <el-radio-button label="humidifier"></el-radio-button>
                  <el-radio-button label="    lamp    "></el-radio-button>
                </el-radio-group> -->
                  <el-select v-model="queryInfo.idCategory" clearable placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value" 
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
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
    </el-container>

    <el-container>
      <el-aside width="830px">
        <el-cards>
          <br />
          <el-row :gutter="25"> </el-row>

          <el-row>
            <div class="pie1">
              <div id="pie1" style="width: 800px; height: 100%">
                asdasdasda!!!
              </div>
            </div>
          </el-row>
          <el-divider></el-divider>

          <el-row>
            <el-col>
              <div class="mainChart" style="color: '#fff'">
                <div id="mainChart" style="width: 800px; height: 90%">
                  <div style="font-size: 16px">
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
          <el-table :data="deviceList" border stripe>
            <!--索引列 -->
            <el-table-column type="index"></el-table-column>

            <!-- 注意顺序,select 的时候不要* 并且 -->
            <el-table-column label="idDevice" prop="idDevice"></el-table-column>
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
              :page-sizes="[15, 50, 100]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
var echarts = require("echarts");

export default {
  created() {
    this.getDeviceList();
    this.useEchart();
  },
  data() {
    return {


        options: [{
          value: '1',
          label: 'humidifier'
        }, {
          value: '2',
          label: 'lamp'
        }],
      
      // 查询信息的实体
      queryInfo: {
        query: "", //查询信息
        pageNum: 1, //当前页
        pageSize: 15, //每页的最大数
        date: ["2020-05-01 00:00:00", "2021-09-21 08:00:00"], //"yyyy-MM-dd HH:mm:ss"
        dividePoint: "",
        splitPoint1: "",
        splitPoint2: "",
        idCategory:"",
        kind: "",
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
      list: [],//存储各个国家的家庭信息，做出饼图用的

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
        "getFamilyCountry",
        this.queryInfo
      );

      console.log("?????????????????????????????????????????");
    
      // 初始化图表格
      var myChart = echarts.init(document.getElementById("pie1"));
      // res.forEach((obj,index)=>{
      //   this.list.push({
      //     value:obj.value,
      //     name:obj.name
      //   })
      // })

      console.log("----------------------------------------------------------");
      console.log(res);
      // console.log("list   "+this.list);
      // console.log(res.value);
      console.log("----------------------------------------------------------");
      // 配置表格的数据Option
      var option = {
        backgroundColor: '#fff',

    title: {
        text: 'Number of families using our system all over the world',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#000'
        }
    },
    legend: {
          left: "left",
          orient: "vertical",

    },
    tooltip: {
        trigger: 'item'
    },

    visualMap: {
        show: false,
        min: -10,
        max: 50,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [
              { value: res.count0, name: res.country0+"" },
              // {value: 310, name: '邮件营销'},
              { value: res.count1, name: res.country1+"" },
              { value: res.count2, name: res.country2+"" },

            ].sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
                // color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
                lineStyle: {
                    // color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
            },
            itemStyle: {
                color: '#235894',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
      };
      myChart.setOption(option);
    },
    async getDeviceList() {
      console.log("get device list!!!");
      console.log(this.queryInfo);

      const { data: res } = await this.$http.post(
        "getRecordCategory",
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
      console.log(
        "--------------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      console.log(this.queryInfo);
      console.log(
        "--------------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );

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
        "getRecordByTwoPoint",
        this.queryInfo
      );

      console.log("-----------------------------");
      console.log(res.r1_0);
      console.log(res.r1_1);
      // console.log(res.r1_2);
      // console.log(res.r1_3);
      // console.log(res.r1_4);
      // console.log(res.r1_5);
      // console.log(res.r1_6);
      // console.log(res.r1_7);
      // console.log(res.r1_8);
      // console.log(res.r1_9);
      // console.log(res.r1_10);
      // console.log(res.r1_11);

      console.log("__________________________________");
      console.log(res.r2_0);
      console.log(res.r2_1);
      console.log(res.r2_2);
      console.log(res.r2_3);
      

      console.log("-----------------------------");

      if (res.smallerThan == 0 && res.equalTo == 0 && res.BiggerThan == 0) {
        return this.$message.error("操作失败!!~");
      }
      this.$message.success("操作成功!!~");
      var myChart = echarts.init(document.getElementById("mainChart"));
      // var buildLine=this.$echarts.init(document.getElementById("buildLine"));
      var xData = [];
      var yData = [];
      var yData2=[];
      xData.push("0-2h");
      xData.push("2-4h");
      xData.push("4-6h");
      xData.push("6-8h");
      xData.push("8-10h");
      xData.push("10-12h");
      xData.push("12-14h");
      xData.push("14-16h");
      xData.push("16-18h");
      xData.push("18-20h");
      xData.push("20-22h");
      xData.push("22-24h");


      yData.push(res.r1_0);
      yData.push(res.r1_1);
      yData.push(res.r1_2);
      yData.push(res.r1_3);
      yData.push(res.r1_4);
      yData.push(res.r1_5);
      yData.push(res.r1_6);
      yData.push(res.r1_7);
      yData.push(res.r1_8);
      yData.push(res.r1_9);
      yData.push(res.r1_10);
      yData.push(res.r1_11);

      yData2.push(res.r2_0);
      yData2.push(res.r2_1);
      yData2.push(res.r2_2);
      yData2.push(res.r2_3);
      yData2.push(res.r2_4);
      yData2.push(res.r2_5);
      yData2.push(res.r2_6);
      yData2.push(res.r2_7);
      yData2.push(res.r2_8);
      yData2.push(res.r2_9);
      yData2.push(res.r2_10);
      yData2.push(res.r2_11);

      console.log("********************************************");
      console.log(xData, yData);
      console.log("********************************************");
      var option2 = {
        // 可以注释掉
        backgroundColor: "#fff",
        title: {
          text: "Chart of " + res.kind + " of family " +this.queryInfo.splitPoint1+" and "+this.queryInfo.splitPoint2 ,
          // subtext: 'What users care most about voice assistants around the world',
          left: "center",
          textStyle: { color: "#000" },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: [""+this.queryInfo.splitPoint1, ""+this.queryInfo.splitPoint2,"bar"],
          orient: "vertical",
          left: "right",
          textStyle: {
            color: "#000",
          },
        },
        xAxis: {
          data: xData,
          axisLine: {
            lineStyle: {
              color: "#000",
            },
          },
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: "#000",
            },
          },
        },
        series: [
          {
            name: ""+this.queryInfo.splitPoint1,
            type: "bar",
            // barWidth: 10,
            itemStyle: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#14c8d4" },
                { offset: 1, color: "#43eec6" },
              ]),
            },
            data: yData,
          },
          {
            name: ""+this.queryInfo.splitPoint1,
            type: "line",
            lineGap: '-100%',
           smooth: true,
            label: {
              show: true,
              position: "top",
            },
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 15,
            data: yData,
                 markLine: {
                   data:[{
                        symbol: 'circle',
                        label: {
                            position: 'end',
                            formatter: 'Average '
                        },
                        type: 'average',
                        name: '平均点'
                    }]
                        // data: [
                        //     { type: 'average', name: '平均值' }
                        // ]
                    }
          },
          
          // {
          //   name: "line",
          //   type: "bar",
          //   // barGap: "-100%",
          //   // barWidth: 10,
          //   itemStyle: {
          //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //       { offset: 0, color: "rgba(20,200,212,0.5)" },
          //       { offset: 0.2, color: "rgba(20,200,212,0.2)" },
          //       { offset: 1, color: "rgba(20,200,212,0)" },
          //     ]),
          //   },
          //   z: -12,
          //   data: yData,
          // },
       
          





///////////////////////

          {
            name: ""+this.queryInfo.splitPoint2,
            type: "bar",
            // barWidth: 10,
            // stack:"test",
            // barGap: "100%",
            itemStyle: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // 绿色
                //  { offset: 0, color: '#7FFFAA' },
                //  { offset: 1, color: '#00FA9A' }

                 { offset: 0, color: '#FF7F50' },
                 { offset: 1, color: '#FF4500' }
              ]),
            },
            data: yData2,
          },
          {
            name: ""+this.queryInfo.splitPoint2,
            type: "line",
            smooth: true,
            lineGap: '-100%',
            // stack:"test",
            // barGap: "100%",
            itemStyle: {
               color: '#8B0000'
            },
            label: {
              show: true,
              position: "top",
            },
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 15,
            data: yData2,
                 markLine: {
                   data:[{
                        symbol: 'circle',
                        label: {
                            position: 'end',
                            formatter: 'Average '
                        },
                        type: 'average',
                        name: '平均点'
                    }]
                        // data: [
                        //     { type: 'average', name: '平均值' }
                        // ]
                    }
          },
         
          // {
          //   name: "line",
          //   type: "bar",
          //   // barGap: "100%",
          //   // stack:"test",
          //   // barWidth: 10,
          //   itemStyle: {
          //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //       { offset: 0, color: "rgba(20,200,212,0.5)" },
          //       { offset: 0.2, color: "rgba(20,200,212,0.2)" },
          //       { offset: 1, color: "rgba(20,200,212,0)" },
          //     ]),
          //   },
          //   z: -12,
          //   data: yData2,
          // },
         

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