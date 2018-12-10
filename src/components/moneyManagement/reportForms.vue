<template>
  <section class="reportForms">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="form"
               ref="form"
               class="demo-form-inline">

        <el-form-item label="报表类型:"
                      prop="reporttype">
          <el-checkbox-group v-model="form.reporttype"
                             :min="1"
                             :max="6">
            <el-checkbox v-for="item in types"
                         :label="item.reporttype"
                         :value="item.reporttype"
                         :key="item.reporttype">{{item.reportname}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <br>
        <el-form-item label="报表日期"
                      prop="date">
          <el-date-picker v-model="form.date"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="resetForm('form')">重置</el-button>
          <el-button type="primary"
                     @click="getList()">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <main>
      <div :id="item.key"
           v-for="(item,index) in arr.dataArr"
           :key="index">{{item.key}}</div>
      <!-- <div id="main1"></div>
      <div id="ordernum"></div>
      <div id="salepercustomer"></div>
      <div id="invitenum"></div>
      <div id="commission"></div>
      <div id="hotarea"></div>
      <div id="newmember"></div> -->
    </main>
  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
export default {
  data() {
    return {
      types: [], //报表类型
      form: {
        reporttype: [],
        starttime: "",
        endtime: "",
        date: [
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30),
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24)
        ]
      },
      arr: {
        dataArr: [],
        myChartArr: []
      },
      other: {
        dailyincome: false, //type为1日收入数据
        ordernum: false, //type为2日订单量数据
        salepercustomer: false, //type为3日客单价数据
        invitenum: false, //type为4日邀请用户数量数据
        commission: false, //type为5日佣金数据
        hotarea: false, //type为6日热卖区域数据
        newmember: false //type为7日新增用户数据
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  components: {
    publicHead
  },

  created() {
    console.log(123);
    this.getReportType();
  },
  mounted() {
    this.getList();
  },
  methods: {
    getReportType() {
      this.$axios.post(this.$location.getShowReportTypes).then(res => {
        this.types = _.get(res, "datalist.reporttypes", []);
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList();
    },
    getList() {
      this.arr.dataArr = [];
      this.arr.myChartArr = [];
      this.$axios
        .post(this.$location.getShowReportDatas, {
          ...this.form,
          starttime:
            this.moment(this.form.date[0]).format("YYYY-MM-DD HH:mm:ss") || "",
          endtime:
            this.moment(this.form.date[1]).format("YYYY-MM-DD HH:mm:ss") || ""
        })
        .then(res => {
          console.log(res);
          let temp = _.get(res, "datalist", []);
          for (let i in temp) {
            console.log(i);
            if (temp[i].datas) {
              let obj = {
                key: i,
                reportname: temp[i].reportname,
                value: temp[i].datas
              };
              this.arr.dataArr.push(obj);
            }
          }
          console.log(this.arr.dataArr);
          this.drawChart();
        });
    },

    drawChart() {
      setTimeout(() => {
        this.arr.dataArr.map(d => {
          console.log(d);
          let xData = [],
            yData = [];
          d.value.map(x => {
            xData.push(x.statisticdate);
            yData.push(x.quantity);
          });
          console.log(xData, yData);
          let chart = this.$echarts.init(document.getElementById(d.key));
          var option = {
            title: {
              text: d.reportname
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985"
                }
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: {
              data: xData
            },
            yAxis: {
              type: "value",
              data: yData
            },
            series: [
              {
                name: d.reportname,
                type: "line",
                data: yData
              }
            ]
          };
          let obj = {
            k: chart,
            v: option
          };
          this.arr.myChartArr.push(obj);
        });
        this.arr.myChartArr.map(d => {
          console.log(d);
          d.k.setOption(d.v);
        });
      }, 0);

      //   console.log(this.arr.myChartArr);
      //   var myChart1 = this.$echarts.init(document.getElementById("main1"));
      //   console.log(myChart1);
      //   var myChart2 = this.$echarts.init(document.getElementById("main2"));
      //   var myChart3 = this.$echarts.init(document.getElementById("main3"));
      //   var myChart4 = this.$echarts.init(document.getElementById("main4"));
      //   var myChart5 = this.$echarts.init(document.getElementById("main5"));
      //   var myChart6 = this.$echarts.init(document.getElementById("main6"));
      //   // 指定图表的配置项和数据
      //   var option = {
      //     title: {
      //       text: "总收入"
      //     },
      //     xAxis: {
      //       data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      //     },
      //     yAxis: {},
      //     series: [
      //       {
      //         name: "销量",
      //         type: "line",
      //         data: [5, 20, 36, 10, 10, 20]
      //       }
      //     ]
      //   };
      //   // 使用刚指定的配置项和数据显示图表。
      //   myChart1.setOption(option);
      //   myChart2.setOption(option);
      //   myChart3.setOption(option);
      //   myChart4.setOption(option);
      //   myChart5.setOption(option);
      //   myChart6.setOption(option);
    }
  }
};
</script>
<style lang="scss">
.reportForms {
  @include public-father-css;
  header {
    .el-form {
      text-align: left;
    }
  }
  main {
    flex: 1;
    // overflow: auto;
    overflow-y: auto;
    // border: 1px solid red;

    > div {
      width: 50%;
      height: 500px;
    }
    @media screen and (max-width: 800px) {
      > div {
        width: 500px;
        height: 500px;
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  main {
    display: flex;
    flex-wrap: wrap;
  }
}
@media screen and (max-width: 800px) {
  .reportForms {
    overflow: auto;
  }
  header {
    overflow: auto;
  }
  main {
    border: 1px solid red;
    width: 800px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
}
</style>