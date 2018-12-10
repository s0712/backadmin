<template>
  <section class="appraiseList">
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
        <el-form-item label="用户昵称:"
                      prop="nickname">
          <el-input v-model="form.nickname"
                    placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="评论状态:"
                      prop="status">
          <el-select v-model="form.status"
                     placeholder="请选择">
            <el-option label="全部"
                       value="1">全部</el-option>
            <el-option label="已删除"
                       value="2">已删除</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间:"
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
    <main>
      <el-table :data="commentlist"
                border
                height="100%">
        <el-table-column prop="date"
                         label="评价时间"
                         width="150">
          <template slot-scope="scope">
            <span>{{ moment(parseInt(scope.row.createtime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serialno"
                         label="订单编号"
                         width="120">
        </el-table-column>
        <el-table-column prop="nickname"
                         label="用户昵称"
                         width="120">
        </el-table-column>
        <el-table-column prop="phoneno"
                         label="用户手机号"
                         width="120">
        </el-table-column>
        <el-table-column prop="content"
                         label="评价内容">
        </el-table-column>
        <el-table-column prop="replycontent"
                         label="回复内容">
        </el-table-column>
        <el-table-column prop="status"
                         label="评论状态">
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'正常':'已删除'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteInfo(scope.row)"
                       type="text"
                       size="small">删除</el-button>
            <el-button @click="reply(scope.row,scope.$index);alert.info=true"
                       type="text"
                       size="small">回复</el-button>
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

    <el-dialog title="回复评价"
               :visible.sync="alert.info">
      <el-form :model="other.dialog_item"
               ref="other.dialog_item">
        <el-form-item label="评论内容"
                      :label-width="formLabelWidth">
          <span>{{other.dialog_item.content}}</span>
        </el-form-item>
        <el-form-item label="回复内容"
                      :label-width="formLabelWidth"
                      prop="replycontent">
          <el-input type="textarea"
                    v-model="other.dialog_item.replycontent"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="resetForm('other.dialog_item');alert.info = false;">取 消</el-button>
        <el-button type="primary"
                   @click="updateReply();alert.info = false">确 定</el-button>
      </div>
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
      form: {
        //查询订单列表表单
        adminid: "", //后台管理员用户唯一标识ID
        token: "", //后台管理员用户用户登陆会话唯一标识
        lantype: "",
        serialno: "", //订单编号
        phoneno: "", // 订单状态 0 全部订单1待支付 2待发货 3待收货 4待评价 5已完成
        nickname: "",
        endtime: "",
        date: [],
        status: "1", //1,//全部 2.已删除
        pageno: 0,
        pagesize: 10
      },
      other: {
        dialog_item: {}, //回复该行对象
        selectIndex: 0 //选中行
      },
      totalnum: 0, //总条数
      currentPage: 1,
      alert: {
        info: false
      },
      formLabelWidth: "80px",
      commentlist: [], //评论内容表格
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
      console.log(can);
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.queryUserCommentList, {
          ...this.form,
          starttime: this.form.date.length ? this.form.date[0] : "",
          endtime: this.form.date.length ? this.form.date[1] : ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.commentlist = _.get(res, "datalist.commentlist", []);
          // console.log(this.orderList)
        });
    },
    //回复评论
    updateReply() {
      this.$axios
        .post(this.$location.replayUserComment, {
          ...this.other.dialog_item,
          parentid: this.other.dialog_item.id
        })
        .then(res => {
          console.log(this.other.dialog_item);
          this.$set(
            this.commentlist,
            [this.other.selectIndex],
            this.other.dialog_item
          );
          console.log(this.commentlist);
          this.$message(res.message);
          console.log(res);
        });
    },
    deleteInfo(row) {
      this.$confirm("确定删除该条评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.$location.deleteUserComment, {
              ...row
            })
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList(true);
            });
        })
        .catch(() => {});
    },
    reply(row, index) {
      this.other.dialog_item = _.cloneDeep(row);
      this.other.selectIndex = index;
      console.log(row);
    },
    onSubmit() {
      console.log("submit!");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style lang="scss">
.appraiseList {
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
  .el-dialog {
    .el-dialog__header {
      text-align: left;
    }
    > .el-dialog__body {
      padding: 10px 20px 30px;
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
      .el-form-item__content {
        text-align: left;
      }
    }
  }
}
</style>