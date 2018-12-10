<template>
  <section class="setUser">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="nav_form"
               ref="nav_form"
               class="demo-form-inline">
        <el-form-item label="公司名称:"
                      prop="companyname">
          <el-select v-model="nav_form.companyid"
                     placeholder="请选择"
                     @change="(val)=>getDepartArr(val)">
            <el-option v-for="item in arr.companyArr"
                       :key="item.companyid"
                       :label="item.companyname"
                       :value="item.companyid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称:"
                      prop="departmentname">
          <el-select v-model="nav_form.departmentid"
                     placeholder="请选择">
            <el-option v-for="item in arr.departmentlistArr"
                       :key="item.departmentid"
                       :label="item.departmentname"
                       :value="item.departmentid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录名:"
                      prop="loginname">
          <el-input v-model="nav_form.loginname"
                    placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名:"
                      prop="nickname">
          <el-input v-model="nav_form.nickname"
                    placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号:"
                      prop="goodname">
          <el-input v-model="nav_form.phoneno"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="resetForm('form')">重置</el-button>
          <el-button type="primary"
                     @click="getList(0)">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <nav style="text-align:right;margin-bottom:15px;">
      <el-button type="primary"
                 @click="editRow()">新增用户</el-button>
    </nav>
    <el-table :data="tableData"
              border
              style="width: 100%;"
              height="250">
      <el-table-column prop="companyname"
                       label="公司"
                       width="180">
      </el-table-column>
      <el-table-column prop="departmentname"
                       label="部门">
      </el-table-column>
      <el-table-column prop="loginname"
                       label="用户登录名"
                       width="180">
      </el-table-column>
      <el-table-column prop="nickname"
                       label="姓名"
                       width="180">
      </el-table-column>
      <el-table-column prop="rolename"
                       label="用户角色"
                       width="180">
      </el-table-column>
      <el-table-column prop="phoneno"
                       label="电话">
      </el-table-column>

      <el-table-column prop="workno"
                       label="工号">
      </el-table-column>

      <el-table-column fixed="right"
                       label="操作"
                       width="100">
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
    <el-dialog title="编辑用户"
               :visible.sync="alert.editProduct"
               width="60%">
      <el-form :model="form"
               ref="dialog_form">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth"
                      prop="loginname">
          <el-input v-model="form.loginname"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码"
                      :label-width="formLabelWidth"
                      prop="password">
          <el-input v-model="form.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名"
                      :label-width="formLabelWidth"
                      prop="nickname">
          <el-input v-model="form.nickname"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      :label-width="formLabelWidth"
                      prop="phoneno">
          <el-input v-model="form.phoneno"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在公司:"
                      prop="companyid">
          <el-select v-model="form.companyid"
                     placeholder="请选择"
                     @change="(val)=>getDepartArr(val)">
            <el-option v-for="item in arr.companyArr"
                       :key="item.companyid"
                       :label="item.companyname"
                       :value="item.companyid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      label="所在部门:"
                      prop="departmentid">
          <el-select v-model="value"
                     placeholder="请选择">
            <el-option v-for="item in arr.departmentlistArr"
                       :key="item.departmentid"
                       :label="item.departmentname"
                       :value="item.departmentid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      label="选择角色:"
                      prop="roleid">
          <el-select v-model="form.roleid"
                     placeholder="请选择">
            <el-option v-for="item in arr.roleArr"
                       :key="item.roleid"
                       :label="item.rolename"
                       :value="item.roleid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工号"
                      :label-width="formLabelWidth"
                      prop="workno">
          <el-input v-model="form.workno"
                    autocomplete="off"></el-input>
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
        //导航表单
        companyid: "", //公司名称id
        departmentid: "", //部门ID
        nickname: "", //姓名
        loginname: "", //登录名
        phoneno: "", //手机号
        pageno: 0,
        pagesize: 10
      },
      form: {
        companyid: "", //公司名称id
        departmentid: "", //部门ID
        loginname: "", //用户名
        password: "", //密码
        nickname: "", //姓名
        phoneno: "", //电话
        workno: "", //工号
        roleid: "" //角色id
      },

      formLabelWidth: "80px",
      totalnum: 0, //分页总条数
      tableData: [],
      arr: {
        companyArr: [], //公司下拉列表
        departmentlistArr: [], //部门下拉列表
        roleArr: [] //角色下拉列表
      },
      alert: {
        editProduct: false
      },
      other: {
        title: ""
      },
      currentPage: 1,
      value: ""
    };
  },
  components: {
    publicHead
  },
  created() {
    this.getCompanyArr();
    this.getDepartArr();
    this.getRoleArr();
    this.getList(0);
    this.copy_form = _.clone(this.form);
  },
  methods: {
    //获取公司下拉列表
    getCompanyArr() {
      this.$axios.post(this.$location.querySelectCompanyList).then(res => {
        // console.log(res);
        this.arr.companyArr = _.get(res, "datalist.companylist", []);
        console.log(this.arr.companyArr);
      });
    },
    //获取部门下拉列表
    getDepartArr(val) {
      this.$axios
        .post(this.$location.querySelectDepartmentList, {
          companyid: val || ""
        })
        .then(res => {
          //   console.log(res);
          this.arr.departmentlistArr = _.get(
            res,
            "datalist.departmentlist",
            []
          );
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
          //   console.log(res);
          this.arr.roleArr = _.get(res, "datalist", []);
          console.log(this.arr.roleArr);
        });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList(0);
    },
    //获取所有数据
    getList(can) {
      can == 0 ? (this.nav_form.pageno = 0) : (this.nav_form.pageno = can);
      this.$axios
        .post(this.$location.queryOperateUserList, {
          ...this.nav_form
        })
        .then(res => {
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.tableData = _.get(res, "datalist", []);
          console.log(this.tableData);
        });
    },
    editRow(row) {
      console.log(row);
      if (!row) {
        this.other.title = "新增用户";
        this.form = _.clone(this.copy_form);
      } else {
        console.log(row);
        this.other.title = "编辑用户";
        this.form = Object.assign(this.form, row);
      }
      this.alert.editProduct = true;
    },
    //弹窗内保存
    saveRow() {
      let url =
        this.other.title == "新增用户"
          ? this.$location.addOperateUser
          : this.$location.updateOperateUserInfo;
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
      this.$confirm(`确定删除 ${row.loginname} 的所有信息?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.$location.deleteOperateUserInfo, {
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
.setUser {
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
          }
        }
        .el-input {
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