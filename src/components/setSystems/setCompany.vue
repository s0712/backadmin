<template>
  <section class="setCompany">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="nav_form"
               ref="nav_form"
               class="demo-form-inline">
        <el-form-item label="公司名称:"
                      prop="companyname">
          <el-select v-model="nav_form.companyid"
                     placeholder="请选择">
            <el-option v-for="item in arr.companyArr"
                       :key="item.companyid"
                       :label="item.companyname"
                       :value="item.companyid">
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
                 @click="showEdit();">新增公司</el-button>
    </nav>
    <el-table :data="tableData"
              border
              style="width: 100%;"
              height="250">

      <el-table-column prop="companyid"
                       label="公司ID"
                       width="180">
      </el-table-column>
      <el-table-column prop="companyname"
                       label="公司名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="description"
                       label="公司信息描述">
      </el-table-column>
      <el-table-column prop="phoneno"
                       label="公司电话"
                       width="180">
      </el-table-column>
      <el-table-column prop="name"
                       label="公司地址"
                       width="180">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
          <font v-if="scope.row.province">/</font>
          <span>{{scope.row.city}}</span>
          <font v-if="scope.row.city">/</font>
          <span>{{scope.row.area}}</span>
          <font v-if="scope.row.area">/</font>
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address"
                       label="公司logo"
                       width="100">
        <template slot-scope="scope">
          <img :src="`${$location.showimgURL}/${scope.row.logo}`"
               alt="">
        </template>
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
               ref="form">
        <el-form-item label="公司名称"
                      :label-width="formLabelWidth"
                      prop="companyname">
          <el-input v-model="form.companyname"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司电话"
                      :label-width="formLabelWidth"
                      prop="phoneno">
          <el-input v-model="form.phoneno"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在地区"
                      :label-width="formLabelWidth"
                      prop="provinces">
          <el-cascader clearable
                       expand-trigger="hover"
                       :options="arr.addressArr"
                       v-model="form.provinces"
                       :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="街道门牌号"
                      :label-width="formLabelWidth"
                      prop="address">
          <el-input v-model="form.address"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="info"
                      label="公司简介"
                      :label-width="formLabelWidth"
                      prop="description">
          <el-input type="textarea"
                    :rows="2"
                    placeholder="请输入公司简介"
                    v-model="form.description">
          </el-input>

        </el-form-item>
        <el-form-item :label-width="formLabelWidth"
                      label="公司logo:"
                      prop="logo_temp">
          <el-upload :class="{'hideupload':form.logo_temp.length>=1}"
                     :limit="1"
                     :action="$location.uploadFilePhoto"
                     list-type="picture-card"
                     :on-remove="(file,fileList)=>removePicture(file,fileList,'logo_temp','logo')"
                     :on-success="(response, file, fileList)=>handlePicture(response, file, fileList,'logo_temp','logo')"
                     :file-list="form.logo_temp"
                     :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="alert.editProduct = false;">取 消</el-button>
        <el-button type="primary"
                   @click="alert.editProduct = false;saveRow();">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
import addressArr from "../../assets/js/province.js";
export default {
  data() {
    return {
      nav_form: {
        //导航表单
        companyid: "", //公司名称
        pageno: 0,
        pagesize: 10
      },
      form: {
        companyname: "", //公司名称
        phoneno: "", //公司电话
        provinces: [], //公司省
        description: "", //公司简介
        address: "", //公司地址 街道门牌号
        logo_temp: [],
        logo: "" //公司logo图片路径
      },
      props: {
        //商品所在地级联属性
        value: "name",
        children: "cityList",
        label: "name"
      },
      arr: {
        addressArr: [],
        companyArr: [] //公司下拉列表
      },
      other: {
        title: "新增公司"
      },
      alert: {
        editProduct: false
      },
      formLabelWidth: "90px",
      totalnum: 0, //分页总条数
      currentPage: 1,
      tableData: [], //表格数据
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
      ]
    };
  },
  components: {
    publicHead
  },
  created() {
    this.arr.addressArr = addressArr;
    //获取公司下拉数据
    this.getCompanyArr();
    this.getList(0);
    this.copy_form = _.clone(this.form);
  },
  methods: {
    //新增公司
    showEdit() {
      this.other.title = "新增公司";
      this.alert.editProduct = true;
      this.form = _.clone(this.copy_form);
    },
    //获取公司下拉列表
    getCompanyArr() {
      this.$axios.post(this.$location.querySelectCompanyList).then(res => {
        // console.log(res);
        this.arr.companyArr = _.get(res, "datalist.companylist", []);
        console.log(this.arr.companyArr);
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
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.tableData = _.get(res, "datalist.companylist", []);
          console.log(this.tableData);
        });
    },
    //编辑信息
    editRow(row) {
      console.log(row);
      this.other.title = "编辑公司";
      this.alert.editProduct = true;
      this.form = Object.assign(this.form, row);
      this.form.provinces = [
        this.form.province,
        this.form.city,
        this.form.area
      ];
      this.form.logo_temp = [];
      this.form.logo.split(",").map(d => {
        let obj = {
          url: this.$location.showimgURL + d
        };
        this.form.logo_temp.push(obj);
      });
      console.log(this.form);
    },
    //弹窗内保存
    saveRow() {
      let url =
        this.other.title == "新增公司"
          ? this.$location.addCompanyInfo
          : this.$location.updateCompanyInfo;
      console.log(url, this.form);
      this.$axios
        .post(url, {
          ...this.form
        })
        .then(res => {
          console.log(res);
          this.$message(res.message);
          this.form = _.clone(this.copy_form);
          this.getList(this.currentPage - 1);
          this.getCompanyArr();
        });
    },
    //删除信息
    deleteRow(row) {
      console.log(row);
      this.$confirm(`确定删除 ${row.companyname} 公司的所有信息?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(this.$location.deleteCompanyInfo, {
              ...row
            })
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList(this.currentPage - 1);
            });
        })
        .catch(() => {});
    },
    //上传图片限制 <4M
    beforeAvatarUpload(file) {
      const isJPG = file.type;
      const isLt2M = file.size / 2048 / 2048 < 2;
      if (isJPG !== "image/png" && isJPG !== "image/jpeg") {
        this.$message.error("上传头像图片只能是 JPG 或者 PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 4MB!");
        return false;
      }
      return isJPG && isLt2M;
    },
    //删除图片
    removePicture(file, fileList, arr, str) {
      this.form[arr] = fileList;
      this.form[str] = "";
    },
    //获取图片
    handlePicture(response, file, fileList, arr, str) {
      this.form[arr] = fileList;
      this.form[str] = fileList
        .map(d => d.response.datalist.photoname)
        .join(",");
    }
  }
};
</script>
<style lang="scss">
.setCompany {
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
        width: 80px;
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
          .hideupload {
            .el-upload {
              display: none;
            }
          }
        }
        .info {
          width: 100%;
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