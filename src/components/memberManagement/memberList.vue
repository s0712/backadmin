<template>
  <section class="memberList">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="form"
               ref="form"
               class="demo-form-inline">
        <el-form-item label="会员昵称:"
                      prop="nickname">
          <el-input v-model="form.nickname"
                    placeholder="请输入会员昵称"></el-input>
        </el-form-item>
        <el-form-item label="会员手机号:"
                      prop="phoneno">
          <el-input type="number"
                    v-model="form.phoneno"
                    placeholder="请输入会员手机号"></el-input>
        </el-form-item>
        <el-form-item label="活动时间"
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
    <el-table :data="userlist"
              border
              style="width: 100%;"
              height="250">
      <el-table-column fixed
                       prop="userid"
                       label="会员ID"
                       width="150">
      </el-table-column>
      <el-table-column prop="nickname"
                       label="会员昵称"
                       width="120">
      </el-table-column>
      <el-table-column prop="phoneno"
                       label="会员手机号"
                       width="120">
      </el-table-column>
      <el-table-column prop="isvip"
                       label="是否VIP"
                       width="80">
        <template slot-scope="scope">
          <span>{{['否','是'][scope.row.isvip]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime"
                       label="注册时间"
                       width="160">

      </el-table-column>
      <el-table-column prop="zip"
                       label="提现记录"
                       width="120">
        <template slot-scope="scope">
          <el-button @click="getMoneyList(true,scope.row,0);alert.tixian=true"
                     type="text"
                     size="small">详情</el-button>

        </template>
      </el-table-column>
      <el-table-column prop="zip"
                       label="邀请列表"
                       width="120">
        <template slot-scope="scope">
          <el-button @click="getInviteList(true,scope.row,0);alert.invite=true"
                     type="text"
                     size="small">查看</el-button>

        </template>
      </el-table-column>
      <el-table-column prop="zip"
                       label="账户状态">
        <template slot-scope="scope">
          <span>{{['','正常','冻结'][scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作">
        <template slot-scope="scope">
          <el-button @click="freeze(scope.row,scope.$index)"
                     type="text"
                     size="small">{{scope.row.status==2?'解冻用户':'冻结用户'}}</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="totalnum"
                   @current-change="getList(currentPage-1)"
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
    <el-dialog class="second_eldialog"
               title="邀请列表"
               :visible.sync="alert.invite"
               width="1000px">
      <el-tabs @tab-click="getInviteList(false,null,0)"
               v-model="invite_dialog_Item.level">
        <el-tab-pane label="一级邀请列表"
                     name="1">一级邀请列表</el-tab-pane>
        <el-tab-pane label="二级邀请列表"
                     name="2">二级邀请列表</el-tab-pane>
      </el-tabs>
      <el-table :data="other.invite_table"
                border
                height="550px">
        <el-table-column property="nickname"
                         label="下级昵称"
                         width="200"></el-table-column>
        <el-table-column property="address"
                         label="绑定日期"
                         width="200">
          <template slot-scope="scope">
            <span>{{moment(parseInt(scope.row.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column property="consumeamount"
                         label="历史消费总金额(元)"></el-table-column>
        <el-table-column property="totalcommission"
                         label="产生佣金总额(元)"></el-table-column>
      </el-table>
      <el-pagination v-if="other.invite_totalnum"
                     @current-change="getInviteList(false,invite_dialog_Item,other.inviteCurrentPage-1)"
                     :current-page.sync="other.inviteCurrentPage"
                     layout="prev, pager, next, jumper"
                     :total="other.invite_totalnum">
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

        phoneno: "", //收货人号码
        nickname: "", //用户昵称
        starttime: "", //下单开始时间
        endtime: "", //下单结束时间
        date: [],
        pageno: 0,
        pagesize: 10
      },
      totalnum: 0, //总条数
      userlist: [], //用户表格
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
    //查询
    getList(can) {
      console.log(can);
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.queryMemberList, {
          ...this.form,
          starttime: this.form.date.length ? this.form.date[0] : "",
          endtime: this.form.date.length ? this.form.date[1] : ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.userlist = _.get(res, "datalist.userlist", []);
          console.log(this.userlist);
        });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    },
    //获取邀请列表
    getInviteList(can, row = {}, pageno, level) {
      if (true) {
        this.invite_dialog_Item = Object.assign(
          this.invite_dialog_Item,
          _.cloneDeep(row)
        );
      }
      console.log(this.invite_dialog_Item);
      this.$axios
        .post(this.$location.queryUserInviteList, {
          ...this.invite_dialog_Item,
          pageno: pageno,
          pagesize: this.form.pagesize
        })
        .then(res => {
          console.log(res);
          this.other.invite_totalnum = parseInt(
            _.get(res, "datalist.totalnum", 0)
          );
          // console.log(this.other.invite_totalnum)
          this.other.invite_table = _.get(res, "datalist.userlist", []);
          // this.other.invite_dataList=_.get(res,'datalist',{});
        });
    },
    freeze(row, index) {
      this.$axios
        .post(this.$location.letUserFreeze, {
          ...row,
          status: row.status == 1 ? 2 : 1
        })
        .then(res => {
          console.log(res);
          this.$set(row, "status", row.status == 1 ? 2 : 1);
          this.$message(res.message);
        });
    }
  }
};
</script>
<style lang="scss">
.memberList {
  @include public-father-css;
  header {
    .el-form {
      text-align: left;
    }
  }
  .el-table {
    flex: 1;
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