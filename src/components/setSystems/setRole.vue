<template>
  <section class="setRole">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="nav_form"
               ref="nav_form"
               class="demo-form-inline">
        <el-form-item label="角色名称:"
                      prop="roleid">
          <el-select v-model="nav_form.roleid"
                     placeholder="请选择">
            <el-option v-for="item in tableData"
                       :key="item.roleid"
                       :label="item.rolename"
                       :value="item.roleid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="resetForm('nav_form')">重置</el-button>
          <el-button type="primary"
                     @click="getList(0)">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <nav style="text-align:right;margin-bottom:15px;">
      <el-button type="primary"
                 @click="editRow()">新增角色</el-button>
    </nav>
    <el-table :data="tableData"
              border
              style="width: 100%;"
              height="250">

      <el-table-column prop="rolename"
                       label="角色名称">
      </el-table-column>
      <el-table-column prop="status"
                       label="状态">
        <template slot-scope="scope">
          <span>{{['','启用','禁用'][parseInt(scope.row.status)]}}</span>
        </template>
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
               width="50%"
               @close="closeDialog">
      <el-form :model="form"
               ref="dialog_form">
        <el-form-item label="角色名称"
                      :label-width="formLabelWidth"
                      prop="rolename">
          <el-input v-model="form.rolename"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否启用"
                      :label-width="formLabelWidth"
                      prop="status">
          <el-radio v-model="form.status"
                    label="1">是</el-radio>
          <el-radio v-model="form.status"
                    label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="菜单权限"
                      :label-width="formLabelWidth">
          <div class="box">
            <el-tree :data="this.arr.menulist"
                     show-checkbox
                     node-key="menuid"
                     ref="tree"
                     :default-expanded-keys="form.checkedArr"
                     :default-checked-keys="form.checkedArr"
                     :props="defaultProps">
            </el-tree>
          </div>

        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="alert.editProduct = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRow()">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";

export default {
  data() {
    return {
      defaultProps: {
        children: "submenulist",
        label: "name"
      },
      nav_form: {
        //导航表单
        roleid: "", //角色名称id
        pageno: 0,
        pagesize: 10
      },
      form: {
        rolename: "", //角色名称
        modules: [], //菜单数组
        describe: "", //描述
        status: "", //1  启用 2 禁用
        checkedArr: [] //被选中的菜单
      },
      other: {
        title: ""
      },
      formLabelWidth: "80px",
      totalnum: 0, //分页总条数
      tableData: [],
      arr: {
        roleArr: [],
        menulist: [] //菜单列表
      },
      alert: {
        editProduct: false //编辑商品
      },
      currentPage: 1
    };
  },
  components: {
    publicHead
  },
  created() {
    this.getRoleArr();
    this.getList(0);
    this.getMenulist();
    this.copy_form = _.cloneDeep(this.form);
  },
  methods: {
    //关闭弹窗钱回调
    closeDialog() {
      this.resetChecked();
    },
    handleCheckChange(data, checked) {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    //获取菜单列表
    getMenulist() {
      this.$axios.post(this.$location.queryAllSysMenuList).then(res => {
        console.log(res);
        this.arr.menulist = _.get(res, "datalist.menulist", []);
      });
    },
    //获取角色下拉列表
    getRoleArr() {
      this.$axios
        .post(this.$location.queryRoleList, {
          role: "",
          rolename: ""
        })
        .then(res => {
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.tableData = _.get(res, "datalist.rolelist", []);
          console.log(this.tableData);
        });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList(true);
    },
    //获取所有数据
    getList(can) {
      can == 0 ? (this.nav_form.pageno = 0) : (this.nav_form.pageno = can);
      this.$axios
        .post(this.$location.queryRoleList, {
          ...this.nav_form
        })
        .then(res => {
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.tableData = _.get(res, "datalist.rolelist", []);
          console.log(this.tableData);
        });
    },
    editRow(row) {
      console.log(row);
      if (!row) {
        this.other.title = "新增角色";
        this.form = _.cloneDeep(this.copy_form);
      } else {
        console.log(row);
        this.form = _.cloneDeep(this.copy_form);
        this.other.title = "编辑角色";
        this.form = Object.assign(this.form, row);
        this.form.trumenulist.map(i => {
          if (i.submenulist.length) {
            i.submenulist.map(d => {
              this.form.checkedArr.push(d.menuid);
            });
          }
        });
        console.log(this.arr.menulist, this.form.checkedArr);
      }
      setTimeout(() => {
        this.alert.editProduct = true;
      }, 0);
    },
    resetChecked() {
      console.log(this.$refs.tree);
      this.$refs.tree.setCheckedKeys([]);
    },
    //弹窗内保存
    saveRow() {
      //   console.log();
      let checkdata = this.dealTree(this.$refs.tree.getCheckedNodes());
      console.log(checkdata);
      let url =
        this.other.title == "新增角色"
          ? this.$location.addRoleInof
          : this.$location.updateRoleInfo;
      console.log(url, this.form);
      this.$axios
        .post(url, {
          ...this.form,
          modules: checkdata
        })
        .then(res => {
          this.$message(res.message);
          this.form = _.cloneDeep(this.copy_form);
          this.getList(0);

          this.alert.editProduct = false;
        });
    },
    dealTree(data) {
      console.log(data);
      var s = new Set();
      data.map(d => {
        //说明是子菜单,遍历找到父id
        if (d.url) {
          this.arr.menulist.map(m => {
            if (m.submenulist.length) {
              m.submenulist.map(t => {
                if (t.menuid == d.menuid) {
                  s.add(m.menuid);
                }
              });
            }
          });
        }
        s.add(d.menuid);
      });
      return Array.from(s);
    },
    deleteRow(row) {
      this.$confirm(`确定删除 ${row.rolename} 的所有信息?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.$location.deleteRoleInfo, {
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
.setRole {
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
            align-items: center;
            flex: 1;
          }
        }
        .el-form-item:last-child {
          width: 100%;
          .box {
            border: 1px solid #eee;
            flex: 1;
            height: 300px;
            overflow-y: auto;
          }
          .btnbox {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100px;
            height: 100%;
            .el-button + .el-button {
              margin-left: 0;
            }
          }
        }
        .el-input,
        .el-select {
          flex: 1;
          max-width: 250px;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
}
</style>