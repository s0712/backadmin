<template>
  <section class="brokerageDetail">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="form"
               ref="form"
               class="demo-form-inline">

        <el-form-item label="用户昵称:"
                      prop="nickname">
          <el-input v-model="form.nickname"
                    placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号:"
                      prop="phoneno">
          <el-input type="number"
                    v-model="form.phoneno"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
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
    <el-table :data="commissionlist"
              border
              style="width: 100%;"
              height="250">
      <el-table-column fixed
                       prop="serialno"
                       label="订单编号">
      </el-table-column>
      <el-table-column prop="nickname"
                       label="用户昵称"
                       width="150">
      </el-table-column>
      <el-table-column prop="amount"
                       label="订单总金额"
                       width="120">
      </el-table-column>
      <el-table-column prop="payamount"
                       label="现金支付金额"
                       width="120">
      </el-table-column>
      <el-table-column prop="commission"
                       label="佣金金额"
                       width="120">
      </el-table-column>
      <el-table-column prop="commission"
                       label="支付方式"
                       width="120">
        <template slot-scope="scope">
          <span>{{['',"余额","云币"][scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime"
                       label="日期">
        <template slot-scope="scope">
          <span>{{moment(parseInt(scope.row.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="zip"
                       label="操作">
        <template slot-scope="scope">
          <el-button @click="getMoneyList(true,scope.row,0);alert.tixian=true"
                     type="text"
                     size="small">详情</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="getList(currentPage-1)"
                   :current-page.sync="currentPage"
                   layout="prev, pager, next, jumper"
                   :total="totalnum">
    </el-pagination>
    <el-dialog custom-class="first_eldialog"
               title="提现金额"
               :visible.sync="alert.tixian">
      <p><span>历史佣金总额：{{other.money_dataList.totalamount}}元</span><span>现有余额：{{other.money_dataList.amount}}元</span></p>
      <font>提现记录</font>
      <el-table :data="other.money_table"
                border
                height="350px">
        <el-table-column property="date"
                         label="日期">
          <template slot-scope="scope">
            <span>{{ moment(parseInt(scope.row.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column property="amount"
                         label="提现金额"></el-table-column>

      </el-table>
      <el-pagination v-if="other.money_totalnum"
                     @current-change="getMoneyList(false,money_dialog_Item,other.moneyCurrentPage-1)"
                     :current-page.sync="other.moneyCurrentPage"
                     layout="prev, pager, next, jumper"
                     :total="other.money_totalnum">
      </el-pagination>
    </el-dialog>

  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
export default {
  data() {
    return {
      form: {
        //查询订单列表表单
        adminid: "", //后台管理员用户唯一标识ID
        token: "", //后台管理员用户用户登陆会话唯一标识
        lantype: "",
        nickname: "", //用户昵称
        serialno: "", //订单编号
        phoneno: "", //手机号
        starttime: "",
        endtime: "",
        date: [],
        pageno: 0,
        pagesize: 10
      },
      totalnum: 0,
      commissionlist: [],
      other: {
        moneyCurrentPage: 1, //提现默认当前页
        money_totalnum: 0, //提现表格总条数
        money_table: [], //提现表格
        money_dataList: {}, //提现对象
        inviteCurrentPage: 1, //邀请默认当前页
        invite_totalnum: 0, //邀请表格总条数
        invite_table: [], //邀请表格
        invite_dataList: {} //邀请对象
      },
      money_dialog_Item: {}, //当前行提现记录
      invite_dialog_Item: {
        //当前行邀请记录
        level: "1"
      },
      alert: {
        tixian: false,
        invite: false
      },
      currentPage: 1,
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
    this.getList(true);
  },
  methods: {
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //查询
    getList(can) {
      console.log(can);
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.queryCommissionList, {
          ...this.form,
          starttime: this.form.date[0] || "",
          endtime: this.form.date[1] || ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.commissionlist = _.get(res, "datalist.commissionlist", []);
          console.log(this.commissionlist);
        });
    },
    //获取提现列表
    getMoneyList(can, row = {}, pageno) {
      if (can) {
        this.money_dialog_Item = _.cloneDeep(row);
      }
      console.log(this.money_dialog_Item);
      this.$axios
        .post(this.$location.queryWithdrawList, {
          ...this.money_dialog_Item,
          pageno: pageno,
          pagesize: this.form.pagesize
        })
        .then(res => {
          console.log(res);
          this.other.money_totalnum = parseInt(
            _.get(res, "datalist.totalnum", 0)
          );
          console.log(this.other.money_totalnum);
          this.other.money_table = _.get(res, "datalist.withdrawlist", []);
          this.other.money_dataList = _.get(res, "datalist", {});
        });
    }
  }
};
</script>
<style scoped lang="scss">
.brokerageDetail {
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
  .first_eldialog {
    .el-dialog__header {
      text-align: left;
    }
    .el-dialog__body {
      text-align: left;
      padding: 0 20px 30px;
      > p {
        display: flex;
        height: 45px;
        align-items: center;
        span {
          flex: 1;
          text-align: left;
        }
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
      }
      .el-table {
        margin-top: 10px;
      }
    }
  }
  .second_eldialog {
    > .el-dialog {
      margin-top: 6vh !important;
    }
    .el-dialog__header {
      text-align: left;
    }
    .el-tabs__content {
      display: none;
    }
  }
}
</style>