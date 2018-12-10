<template>
  <section class="moneyDetail">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="form"
               ref="form"
               class="demo-form-inline">

        <el-form-item label="订单编号:"
                      prop="serialno">
          <el-input v-model="form.serialno"
                    placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="查询日期"
                      prop="date">
          <el-date-picker v-model="form.date"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="resetForm('form')">重置</el-button>
          <el-button type="primary"
                     @click="getList(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <el-table :data="orderlist"
              border
              style="width: 100%;"
              height="250">
      <el-table-column fixed
                       prop="userid"
                       label="订单号"
                       width="120">
      </el-table-column>
      <el-table-column prop="amount"
                       label="交易额"
                       width="120">
      </el-table-column>
      <el-table-column prop="payamount"
                       label="用户支付金额"
                       width="120">
      </el-table-column>
      <el-table-column prop="balancepay"
                       label="余额支付金额"
                       width="120">
      </el-table-column>
      <el-table-column prop="yuncoinpay"
                       label="云币支付金额"
                       width="120">
      </el-table-column>
      <el-table-column prop="phoneno"
                       label="支付渠道"
                       width="120">
        <template slot-scope="scope">
          <span>微信</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalcommisson"
                       label="VIP佣金"
                       width="120">
      </el-table-column>
      <el-table-column prop="firstcommisson"
                       label="一级佣金"
                       width="120">
      </el-table-column>
      <el-table-column prop="secondcommisson"
                       label="二级佣金"
                       width="120">
      </el-table-column>
      <el-table-column prop="phoneno"
                       label="交易时间">
        <template slot-scope="scope">
          <span>{{moment(parseInt(scope.row.paytime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @current-change="getList(currentPage-1)"
                   :current-page.sync="currentPage"
                   layout="prev, pager, next, jumper"
                   :total="totalnum">
    </el-pagination>
  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
export default {
  data() {
    return {
      currentPage: 1,
      form: {
        //查询订单列表表单

        phoneno: "",
        starttime: "",
        endtime: "",
        date: [],
        pageno: 0,
        pagesize: 10
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
      },
      totalnum: 0,
      orderlist: []
    };
  },
  components: {
    publicHead
  },
  created() {
    this.getList(true);
  },
  methods: {
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList(true);
    },
    //查询
    getList(can) {
      console.log(can);
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.Adminfinance_queryOrderList, {
          ...this.form,
          starttime: this.form.date[0] || "",
          endtime: this.form.date[1] || ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.orderlist = _.get(res, "datalist.orderlist", []);
          console.log(this.orderlist);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.moneyDetail {
  @include public-father-css;
  header {
    .el-form {
      text-align: left;
    }
  }
  .el-pagination {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>