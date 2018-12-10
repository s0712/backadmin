<template>
  <section class="afterSaleList">
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
        <el-form-item label="退款订单编号:"
                      prop="refundno">
          <el-input v-model="form.refundno"
                    placeholder="请输入退款订单编号"></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号:"
                      prop="phoneno">
          <el-input type="number"
                    v-model="form.phoneno"
                    placeholder="请输入收件人手机号"></el-input>
        </el-form-item>
        <el-form-item label="下单时间"
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
        <el-form-item label="退货申请时间"
                      prop="refund">
          <el-date-picker v-model="form.refund"
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
    <main>
      <el-table :data="orderList"
                border
                height="100%">
        <el-table-column prop="refundno"
                         label="售后编号"
                         width="150">
        </el-table-column>
        <el-table-column prop="serialno"
                         label="订单编号"
                         width="120">
        </el-table-column>
        <el-table-column prop="receiveperson"
                         label="用户昵称"
                         width="120">
        </el-table-column>
        <el-table-column prop="phoneno"
                         label="用户手机号"
                         width="120">
        </el-table-column>
        <el-table-column prop="type"
                         label="售后类型"
                         width="120">
          <template slot-scope="scope">
            <span>{{scope.row.type==1?'退款':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zip"
                         label="售后状态">
          <template slot-scope="scope">
            <span>{{['','用户申请退款','客服审核通过','客服审核不通过'][scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="refundamount"
                         label="退款金额(元)">

        </el-table-column>
        <el-table-column prop="createtime"
                         label="申请时间">
          <template slot-scope="scope">
            <span>{{ moment(parseInt(scope.row.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,scope.$index);alert.info=true"
                       type="text"
                       size="small">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
    </main>

    <el-pagination v-if="totalnum"
                   @current-change="getList(currentPage-1)"
                   :current-page.sync="currentPage"
                   layout="prev, pager, next, jumper"
                   :total="totalnum">
    </el-pagination>
    <el-dialog title="售后订单详情"
               :visible.sync="alert.info"
               width="60%"
               custom-class="wai_dialog">
      <p>
        商品详情
      </p>
      <el-row>

        <el-col :span="12">
          订单编号：{{dialog_form.serialno}}
        </el-col>
        <el-col :span="12">
          订单金额:{{dialog_form.amount}}元
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="12">
          下单时间：{{ moment(parseInt(dialog_form.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}
        </el-col>
        <el-col :span="12">
          退款路径:{{dialog_form.refundpath}}
        </el-col>
      </el-row>

      <p>
        退货详情
      </p>
      <el-row>
        <el-col :span="12">
          退款人姓名：{{dialog_form.receiveperson}}
        </el-col>
        <el-col :span="12">
          退款人电话:{{dialog_form.phoneno}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          退货编号：{{dialog_form.refundno}}
        </el-col>
        <el-col :span="12">
          申请退款金额：{{dialog_form.refundamount}}元
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          申请售后时间：{{moment(parseInt(dialog_form.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}
        </el-col>
        <el-col :span="12">
          退货人地址：{{dialog_form.address}}
        </el-col>
      </el-row>
      <p>
        售后流转详情
      </p>
      <el-table :data="dialog_form.servicelist"
                border
                height="250px"
                width="70%">
        <el-table-column prop="date"
                         label="时间"
                         width="200">
          <template slot-scope="scope">
            <span>{{moment(parseInt(scope.row.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type"
                         label="售后类型"
                         width="200">
          <template slot-scope="scope">
            <span>{{scope.row.type==1?'退款':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payamount"
                         label="商品支付金额(元)"
                         width="200"></el-table-column>
        <el-table-column prop="refundamount"
                         label="申请退款金额(元)"
                         width="200"></el-table-column>
        <el-table-column prop="expressinfo"
                         label="退货物流及单号"
                         width="200"></el-table-column>
        <el-table-column prop="date"
                         label="状态">
          <template slot-scope="scope">
            <span>{{['','用户申请退款','客服审核通过','客服审核不通过'][parseInt(scope.row.status)]}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.status!=1"
                       @click="updateStatus(2)"
                       type="text"
                       size="small">同意申请</el-button>
            <el-button :disabled="scope.row.status!=1"
                       @click="updateStatus(3)"
                       type="text"
                       size="small">驳回申请</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- <span slot="footer">
                <el-button @click="alert.info = false">取 消</el-button>
                <el-button type="primary"
                           @click="alert.info = false">确 定</el-button>
            </span> -->
    </el-dialog>
  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
export default {
  components: {
    publicHead
  },
  data() {
    return {
      currentPage: 1,
      form: {
        phoneno: "", //收货人号码
        serialno: "", //订单编号
        refundno: "", // 退款订单编号
        starttime: "", //下单开始时间
        endtime: "", //下单结束时间
        date: [],
        refund: [],
        refundstarttime: "", //退款开始时间
        refundendtime: "", //退款结束时间
        pageno: 0,
        pagesize: 10
      },
      dialog_form: {
        //弹窗表单
        servicelist: []
      },
      orderList: [], //订单列表
      alert: {
        //弹窗
        info: false
      },
      totalnum: 0, //分页总条数

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
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.queryRefundOrderList, {
          ...this.form,
          starttime: this.form.date.length ? this.form.date[0] : "",
          endtime: this.form.date.length ? this.form.date[1] : "",
          refundstarttime: this.form.refund.length ? this.form.refund[0] : "",
          refundendtime: this.form.refund.length ? this.form.refund[1] : ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.orderList = _.get(res, "datalist.orderlist", []);
          console.log(this.orderList);
        });
    },
    handleClick(row, index) {
      this.dialog_form = _.cloneDeep(row);
      this.tableItemIndex = index;
    },
    //更新状态
    updateStatus(can) {
      this.dialog_form.status = can;
      this.dialog_form.servicelist.map(d => (d.status = can));
      this.$axios
        .post(this.$location.updateRefundStatus, {
          ...this.dialog_form,
          status: can,
          remark: ""
        })
        .then(res => {
          this.$set(this.orderList, [this.tableItemIndex], this.dialog_form);
          this.$message(res.message);
          this.alert.info = false;
        });
    }
  }
};
</script>
<style  lang="scss">
.afterSaleList {
  height: 100%;
  padding: 0 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  header {
    .el-form {
      text-align: left;
    }
  }
  > main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .el-table {
      flex: 1;
      position: absolute;
      width: 100%;
    }
  }

  .el-pagination {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .wai_dialog {
    margin-top: 6vh !important;
    .el-dialog__header {
      text-align: left;
    }
    > .el-dialog__body {
      padding: 0 20px 30px;
      > p {
        text-align: left;
        height: 45px;
        line-height: 45px;
        font-weight: 500;
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
      }
      .el-col {
        text-align: left;
        @include no-wrap;
        margin-bottom: 10px;
        > .el-button {
          padding: 0;
        }
      }
    }
  }
}
</style>