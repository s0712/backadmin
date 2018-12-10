<template>
  <section class="moneyGather">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="form"
               ref="form"
               class="demo-form-inline">

        <el-form-item label="汇总类型:"
                      prop="type">
          <el-select v-model="form.type "
                     clearable
                     placeholder="请选择">
            <el-option label="收入"
                       value="1"></el-option>
            <el-option label="佣金"
                       value="2"></el-option>
          </el-select>
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
        type: "",
        starttime: "",
        endtime: "",
        date: [],
        pageno: 0,
        pagesize: 10
      },
      totalnum: 0,
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
    }
  }
};
</script>
<style  lang="scss">
.moneyGather {
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