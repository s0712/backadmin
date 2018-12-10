<template>
  <section class="orderList">
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
        <el-form-item>
          <el-button type="primary"
                     @click="resetForm('form')">重置</el-button>
          <el-button type="primary"
                     @click="getList(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <p style="text-align:right">
      <el-button type="primary"
                 @click="exportExcel">批量导出</el-button>
    </p>
    <el-tabs v-model="form.orderstatus"
             type="card"
             @tab-click="getList(true)">
      <el-tab-pane label="全部订单"
                   name="0">

      </el-tab-pane>
      <el-tab-pane label="待付款"
                   name="1">

      </el-tab-pane>
      <el-tab-pane label="待发货"
                   name="2">

      </el-tab-pane>
      <el-tab-pane label="待收货"
                   name="3">
      </el-tab-pane>
      <el-tab-pane label="待评价"
                   name="4">
      </el-tab-pane>
      <el-tab-pane label="已完成"
                   name="5">

      </el-tab-pane>
    </el-tabs>
    <section class="allList">
      <p>
        <span>商品信息</span>
        <em></em>
        <span>数量</span>
        <em></em>
        <span>单价(元)</span>
        <em></em>
        <span>实付金额(元)</span>
        <em></em>
        <span>交易状态</span>
        <em></em>
        <span>操作</span>
      </p>
      <!-- {{msg}} -->
      <main>

        <section class="box"
                 v-for="(item,itemIndex) in orderList"
                 :key="itemIndex">
          <div class="content"
               v-for="(product,productIndex) in item.goodslist"
               :key="productIndex">
            <div>
              <!-- <el-checkbox v-model="checked"></el-checkbox> -->
              <img :src="`${$location.showimgURL}/${product.smallphoto}`"
                   alt="">
              <p>
                <font>{{product.goodname}}</font>
              </p>
            </div>
            <div>{{product.buynum}}</div>
            <div>{{product.price}}</div>
            <div>{{product.amount}}</div>
            <div>
              <el-button type="text">{{['','待付款','待发货','待收货','待评价','已完成'][item.orderstatus]}}</el-button>
            </div>
            <div>
              <el-button type="text"
                         @click="cloneitem(item,itemIndex,productIndex);alert.info=true">查看详情</el-button>
            </div>
          </div>
          <p><span>订单编号：{{item.serialno}}</span>
            <span>下单时间：{{ moment(parseInt(item.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
            <span>收货人：{{item.receiveperson}}</span>
            <span>电话：{{item.phoneno}}</span>
            <span>收货地址：{{item.address}}</span>
          </p>
          <section class="fen"></section>
        </section>
      </main>
      <el-pagination v-if="totalnum"
                     @current-change="getList(currentPage-1)"
                     :current-page.sync="currentPage"
                     layout="prev, pager, next, jumper"
                     :total="totalnum">
      </el-pagination>
      <el-dialog title="订单详情"
                 :visible.sync="alert.info"
                 width="60%"
                 custom-class="wai_dialog">
        <p>
          商品详情
        </p>
        <el-row>
          <el-col :span="12">
            商品名称：{{dialog_form.goodslist.length?dialog_form.goodslist[productDialogIndex].goodname:''}}
          </el-col>
          <el-col :span="12">
            订单编号：{{dialog_form.serialno}}
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            订单金额: {{dialog_form.goodslist.length?dialog_form.goodslist[productDialogIndex].amount:''}}元
          </el-col>
          <el-col :span="12">
            需支付金额: {{dialog_form.goodslist.length?dialog_form.goodslist[productDialogIndex].amount:''}}元
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            下单时间：{{ moment(parseInt(dialog_form.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}
          </el-col>
          <el-col :span="12">
            支付时间：{{ moment(parseInt(dialog_form.paytime)*1000).format('YYYY-MM-DD HH:mm:ss')}}
          </el-col>
        </el-row>
        <p>
          收货详情
        </p>
        <el-row>
          <el-col :span="12">
            收货人：{{dialog_form.receiveperson}}
          </el-col>
          <el-col :span="12">
            收货人电话:{{dialog_form.phoneno}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            收货地址：{{dialog_form.address}}
          </el-col>
          <el-col :span="12">
            <el-button type="text"
                       @click="alert.name=true">修改信息</el-button>
          </el-col>
        </el-row>
        <p>
          物流详情
        </p>
        <el-row>
          <el-col :span="12">
            物流公司：{{dialog_form.expressname}}
          </el-col>
          <el-col :span="12">
            物流费用：{{dialog_form.freight}}元
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            物流单号：{{dialog_form.expressno}}
          </el-col>
          <el-col :span="12">
            <el-button type="text"
                       @click="alert.flowinfo=true">修改信息</el-button>
          </el-col>
        </el-row>
        <span slot="footer">
          <el-button @click="alert.info = false">取 消</el-button>
          <el-button type="primary"
                     @click="alert.info = false;updateItem()">确 定</el-button>
        </span>
        <el-dialog width="30%"
                   title="修改信息"
                   :visible.sync="alert.name==true||alert.flowinfo==true"
                   append-to-body
                   custom-class="nei_dialog"
                   :close-on-press-escape="false"
                   :show-close="false">
          <el-form :model="temp_form">
            <el-form-item v-if="alert.name==true"
                          label="收货人"
                          :label-width="formLabelWidth">
              <el-input v-model="temp_form.receiveperson"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="alert.name==true"
                          label="收货人电话"
                          :label-width="formLabelWidth">
              <el-input v-model="temp_form.phoneno"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="alert.name==true"
                          label="收货人地址"
                          :label-width="formLabelWidth">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="temp_form.address">
              </el-input>
            </el-form-item>
            <el-form-item v-if="alert.flowinfo==true"
                          label="物流公司"
                          :label-width="formLabelWidth">
              <el-input v-model="temp_form.expressname"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="alert.flowinfo==true"
                          label="物流单号"
                          :label-width="formLabelWidth">
              <el-input v-model="temp_form.expressno"
                        autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="alert.name = false;alert.flowinfo = false">取 消</el-button>
            <el-button type="primary"
                       @click="alert.name = false;alert.flowinfo = false;Object.assign(dialog_form,temp_form);getList(currentPage-1);">确 定</el-button>
          </span>
        </el-dialog>

      </el-dialog>
    </section>

  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";

export default {
  data() {
    return {
      activeName: "0",
      currentPage: 1, //当前页码
      form: {
        //查询订单列表表单
        adminid: "", //后台管理员用户唯一标识ID
        token: "", //后台管理员用户用户登陆会话唯一标识
        lantype: "",
        phoneno: "", //收货人号码
        serialno: "", //订单编号
        orderstatus: "0", // 订单状态 0 全部订单1待支付 2待发货 3待收货 4待评价 5已完成
        starttime: "",
        endtime: "",
        date: [],
        pageno: 0,
        pagesize: 10
      },
      dialog_form: {
        //查看详情字段
        goodslist: []
      },
      temp_form: {
        //临时保存修改信息表单
      },
      itemIndex: 0, //当前行索引
      productDialogIndex: 0, //dialog中商品的索引
      totalnum: 0, //总条数
      orderList: [], //订单列表数据
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
      alert: {
        info: false,
        name: false,
        flowinfo: false
      },

      formLabelWidth: "100px",
      checked: ""
    };
  },
  components: {
    publicHead
  },
  created() {
    this.getList(true);
  },
  methods: {
    //批量导出
    exportExcel() {
      let starttime = this.form.date.length ? this.form.date[0] : "";
      let endtime = this.form.date.length ? this.form.date[1] : "";
      location.href = `${this.$location.exportOrderListByCond}?adminid=${
        this.form.adminid
      }&token=${this.form.token}&lantype=${this.form.lantype}&phoneno=${
        this.form.phoneno
      }&serialno=${this.form.serialno}&orderstatus=${
        this.form.orderstatus
      }&starttime=${starttime}&token=${endtime}`;
    },
    //查询
    getList(can) {
      console.log(can);
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.queryOrderList, {
          ...this.form,
          starttime: this.form.date.length ? this.form.date[0] : "",
          endtime: this.form.date.length ? this.form.date[1] : ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.orderList = _.get(res, "datalist.orderlist", []);
          console.log(this.orderList);
        });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //克隆当前行/当前行索引及选中商品索引值
    cloneitem(item, itemIndex, productIndex) {
      console.log(item, itemIndex, productIndex);
      this.itemIndex = itemIndex;
      this.productDialogIndex = productIndex;
      this.dialog_form = _.cloneDeep(item);
      this.temp_form = _.cloneDeep(item);
      console.log(this.dialog_form);
    },
    //更新选中商品信息
    updateItem() {
      this.axios
        .post(this.$location.updateExpressData, {
          ...this.dialog_form
        })
        .then(res => {
          this.$set(this.orderList, [this.itemIndex], this.dialog_form);
          this.$message(res.message);
          this.getList(this.currentPage - 1);
        });
    }
  }
};
</script>
<style lang="scss">
.orderList {
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
  .allList {
    flex: 1;
    overflow-y: auto;
    width: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    > p {
      //  width: 1500px;
      height: 40px;
      display: flex;
      align-items: center;
      color: #909399;
      font-weight: 500;
      font-size: 12px;
      span:not(:first-child) {
        flex: 1;
      }
      em {
        border-left: 1px solid #eee;
        height: 20px;
      }
      span:first-child {
        width: 35%;
      }
    }
    main {
      //  max-width:1400px;
      overflow-y: auto;
      flex: 1;
      position: relative;

      .box {
        width: 100%;
        margin-top: 20px;
        .fen {
          height: 10px;
          background: #eee;
          margin-bottom: 20px;
        }
        .content {
          width: 100%;
          height: 100px;
          display: flex;
          div:not(:first-child) {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          }

          div:first-child {
            display: flex;
            align-items: center;
            width: 35%;
            .el-checkbox {
              margin-left: 10px;
            }
            img {
              height: 80px;
              width: 80px;
              margin: 0 10px;
            }
            > p {
              height: 80px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              font {
                text-align: left;
                font-weight: 500;
                font-size: 13px;
                color: #333;
              }
              span {
                @include no-wrap-line(2);
                text-align: justify;
                text-justify: newspaper;
                margin-right: 10px;
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
        > p {
          // border:1px solid red;
          padding: 0 10px;
          display: flex;
          height: 45px;
          font-size: 13px;
          color: #333;
          font-weight: 600;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eee;
          span {
            text-align: left;
          }
        }
      }
    }
    .el-pagination {
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .wai_dialog {
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
      .nei_dialog {
        .el-form {
          .el-input {
            width: 250px;
          }
        }
      }
    }
  }
}
</style>