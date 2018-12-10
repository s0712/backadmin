<template>
  <section class="setMenu">
    <public-head :msg="$route.meta.title"></public-head>

    <nav style="text-align:right;margin-bottom:15px;">
      <el-button type="primary"
                 @click="editRow()">新增菜单</el-button>
    </nav>
    <el-table :data="tableData"
              border
              style="width: 100%;"
              height="250">

      <el-table-column prop="parentname"
                       label="一级菜单"
                       width="180">
      </el-table-column>
      <el-table-column prop="name"
                       label="二级菜单"
                       width="180">
      </el-table-column>
      <el-table-column prop="url"
                       label="路由名称">
      </el-table-column>

      <el-table-column fixed="right"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="editRow(scope.row)"
                     size="small">编辑</el-button>
          <el-button type="text"
                     @click="deleteRow(scope.row)"
                     size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="getList(currentPage-1)"
                   :current-page.sync="currentPage"
                   layout="prev, pager, next, jumper"
                   :total="totalnum">
    </el-pagination>
    <el-dialog :title="other.title"
               :visible.sync="alert.editProduct"
               width="50%">
      <el-form :model="form"
               ref="dialog_form">
        <el-form-item label="一级菜单"
                      :label-width="formLabelWidth">
          <el-input v-model="form.parentname"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="二级菜单"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由名称"
                      :label-width="formLabelWidth">
          <el-input v-model="form.url"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="添加人"
                      :label-width="formLabelWidth">
          <span>admin</span>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="alert.editProduct = false">取 消</el-button>
        <el-button type="primary"
                   @click="alert.editProduct = false;saveRow()">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
export default {
  data() {
    return {
      nav_form: {
        pageno: 0,
        pagesize: 10
      },
      form: {
        name: "", //菜单名称
        url: "", //路由
        remark: "", //描述
        parentname: "" //一级菜单名称
      },
      formLabelWidth: "80px",
      totalnum: 0, //分页总条数
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      other: {
        title: ""
      },
      alert: {
        editProduct: false //编辑商品
      },
      currentPage: 1,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],

      value: ""
    };
  },
  components: {
    publicHead
  },
  created() {
    this.getList(0);
    this.copy_form = _.cloneDeep(this.form);
  },
  methods: {
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList(0);
    },
    //获取所有数据
    getList(can) {
      can == 0 ? (this.nav_form.pageno = 0) : (this.nav_form.pageno = can);
      this.$axios
        .post(this.$location.querySysMenuList, {
          ...this.nav_form
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.tableData = _.get(res, "datalist.menulist", []);
          console.log(this.tableData);
        });
    },
    editRow(row) {
      console.log(row);
      if (!row) {
        this.other.title = "新增菜单";
        this.form = _.clone(this.copy_form);
      } else {
        console.log(row);
        this.other.title = "编辑菜单";
        this.form = Object.assign(this.form, row);
      }
      this.alert.editProduct = true;
    },
    //弹窗内保存
    saveRow() {
      let url =
        this.other.title == "新增菜单"
          ? this.$location.addSysMenu
          : this.$location.updateSysMenuInfo;
      console.log(url, this.form);
      this.$axios
        .post(url, {
          ...this.form
        })
        .then(res => {
          this.$message(res.message);
          this.form = _.clone(this.copy_form);
          this.getList(0);
        });
    },
    deleteRow(row) {
      this.$confirm("确定删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.$location.deleteSysMenuInfo, {
              ...row
            })
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList(0);
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style  lang="scss">
.setMenu {
  @include public-father-css;
  header {
    .el-form {
      text-align: left;
    }
  }
  .el-table {
    flex: 1;
    overflow-y: scroll;
    .cell {
      img {
        height: 80px;
      }
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
      padding: 0 20px 30px;
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 50%;
          display: flex;
          .el-form-item__content {
            margin-left: 0 !important;
            display: flex;
          }
        }
        .el-input {
          flex: 1;
          width: 250px;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
}
</style>