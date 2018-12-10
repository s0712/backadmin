<template>
  <section class="setDepart">
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
          <el-select v-model="nav_form.departmentname"
                     placeholder="请选择">
            <el-option v-for="item in arr.departmentlistArr"
                       :key="item.departmentid"
                       :label="item.departmentname"
                       :value="item.departmentname">
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
                 @click="editRow()">新增部门</el-button>
    </nav>
    <el-table :data="tableData"
              border
              style="width: 100%;"
              height="250">

      <el-table-column prop="companyname"
                       label="公司名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="departmentname"
                       label="部门名称">
      </el-table-column>
      <el-table-column prop="phoneno"
                       label="部门电话"
                       width="180">
      </el-table-column>
      <el-table-column prop="description"
                       label="部门描述"
                       width="180">
      </el-table-column>

      <el-table-column prop="address"
                       label="状态">
        <template slot-scope="scope">
          <span>{{['','正常','删除'][scope.row.status]}}</span>
        </template>
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
    <el-dialog :title="other.title"
               :visible.sync="alert.editProduct"
               width="60%">
      <el-form :model="form"
               ref="dialog_form">
        <el-form-item label="公司名称"
                      :label-width="formLabelWidth"
                      prop="companyid">
          <el-select v-model="form.companyid"
                     placeholder="请选择">
            <el-option v-for="item in arr.companyArr"
                       :key="item.companyid"
                       :label="item.companyname"
                       :value="item.companyid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称"
                      :label-width="formLabelWidth"
                      prop="companyid">
          <el-input v-model="form.departmentname"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="部门电话"
                      :label-width="formLabelWidth"
                      prop="phoneno">
          <el-input v-model="form.phoneno"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="info"
                      label="部门简介"
                      :label-width="formLabelWidth"
                      prop="description">
          <el-input type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="form.description">
          </el-input>

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
        departmentname: "", //部门名称
        pageno: 0,
        pagesize: 10
      },

      form: {
        departmentname: "", //部门名称
        companyid: "", //公司id
        description: "", //公司部门描述
        phoneno: "" //公司部门电话
      },
      arr: {
        companyArr: [], //公司下拉列表
        departmentlistArr: [] //部门下拉列表
      },
      alert: {
        editProduct: false
      },
      other: {
        title: ""
      },
      formLabelWidth: "90px",
      totalnum: 0, //分页总条数
      currentPage: 1,
      tableData: []
    };
  },
  components: {
    publicHead
  },
  created() {
    this.getCompanyArr();
    this.getDepartArr();
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
          console.log(res);
          this.arr.departmentlistArr = _.get(
            res,
            "datalist.departmentlist",
            []
          );
          // console.log(this.arr.companyArr);
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
        .post(this.$location.queryDepartmentList, {
          ...this.nav_form
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.tableData = _.get(res, "datalist.departmentlist", []);
          console.log(this.tableData);
        });
    },
    editRow(row) {
      if (!row) {
        this.other.title = "新增部门";
        this.form = _.clone(this.copy_form);
      } else {
        console.log(row);
        this.other.title = "编辑部门";
        this.form = Object.assign(this.form, row);
      }
      this.alert.editProduct = true;
    },
    //弹窗内保存
    saveRow() {
      let url =
        this.other.title == "新增部门"
          ? this.$location.addDepartmentInfo
          : this.$location.updateDepartmentfo;
      console.log(url, this.form);
      this.$axios
        .post(url, {
          ...this.form
        })
        .then(res => {
          this.$message(res.message);
          this.form = _.clone(this.copy_form);
          this.getList(0);
          this.getDepartArr();
        });
    },
    deleteRow(row) {
      console.log(row);
      this.$confirm(
        `确定删除 ${row.companyname} 公司 ${
          row.departmentname
        } 部门的所有信息?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$axios
            .post(this.$location.deleteDepartmentInfo, {
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
<style lang="scss">
.setDepart {
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
            flex: 1;
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