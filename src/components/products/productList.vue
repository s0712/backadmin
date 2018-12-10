<template>
  <section class="productList">
    <public-head :msg="$route.meta.title"></public-head>
    <header>
      <el-form :inline="true"
               :model="form"
               ref="form"
               class="demo-form-inline">
        <el-form-item label="商品名称:"
                      prop="goodname">
          <el-input v-model="form.goodname"
                    placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类:"
                      prop="categorys">
          <el-cascader clearable
                       expand-trigger="hover"
                       :options="paramsList.categorys"
                       v-model="form.categorys"
                       :props="categorysProps">
          </el-cascader>
        </el-form-item>
        <el-form-item label="创建时间"
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
    <el-table :data="goodlist"
              border
              style="width: 100%;"
              height="250">

      <el-table-column prop="smallphoto"
                       label="缩略图"
                       width="120">
        <template slot-scope="scope">
          <img :src="`${$location.showimgURL}/${scope.row.smallphoto}`"
               alt="">

        </template>
      </el-table-column>
      <el-table-column prop="goodname"
                       label="商品名称"
                       width="120">
      </el-table-column>
      <el-table-column prop="description"
                       label="商品描述"
                       width="120">
      </el-table-column>
      <el-table-column prop="category"
                       label="商品分类"
                       width="120">
        <template slot-scope="scope">
          <span>{{scope.row.category}}/{{scope.row.seccategory}}/{{scope.row.thirdcategory}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalnum"
                       label="库存">
      </el-table-column>

      <el-table-column prop="productprice"
                       label="销售价(元)"
                       width="120">

      </el-table-column>

      <el-table-column prop="status"
                       label="状态">
        <template slot-scope="scope">
          <span>{{['','上架','下架','已删除'][scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-button @click="upOrdown(scope.row)"
                     type="text"
                     size="small">{{scope.row.status==1?'下架':'上架'}}</el-button>
          <el-button type="text"
                     @click="editRow(scope.row)"
                     size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="getList(currentPage-1)"
                   :current-page.sync="currentPage"
                   layout="prev, pager, next, jumper"
                   :total="totalnum">
    </el-pagination>

    <div class="alert">
      <edit-product v-on:returnData="returnData"
                    v-if="alert.editProduct"
                    :returnForm='other.returnForm'
                    :paramsList='paramsList'></edit-product>
    </div>
  </section>

</template>
<script>
import publicHead from "../publicComponent/publicHead";
import editProduct from "../publicComponent/editProduct";
export default {
  data() {
    return {
      form: {
        goodname: "", //商品名称
        categorys: [], //商品分类 大类
        date: [],
        starttime: "", //下单开始时间
        endtime: "", //下单结束时间
        pageno: 0,
        pagesize: 10
      },
      totalnum: 0, //分页总条数
      goodlist: [], //商品表格数据
      other: {
        returnForm: {}
      },
      alert: {
        editProduct: false //编辑商品
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
      },
      paramsList: {
        categorys: []
      }, //参数列表
      categorysProps: {
        //商品分类级联属性
        value: "cateid",
        children: "subcategorys",
        label: "catename"
      }
    };
  },
  components: {
    publicHead,
    editProduct
  },
  created() {
    this.getProductParams();
    this.getList(true);
  },
  methods: {
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList(true);
    },
    //获取商品参数列表
    getProductParams() {
      this.axios.post(this.$location.getProductParams).then(res => {
        this.paramsList = _.get(res, "datalist", {});
        console.log(this.paramsList);
      });
    },
    //查询
    getList(can) {
      can == 0 ? (this.form.pageno = 0) : (this.form.pageno = can);
      console.log(this.form);
      this.$axios
        .post(this.$location.queryGoodsList, {
          ...this.form,
          categorys: this.form.categorys.join(","),
          starttime: this.form.date.length ? this.form.date[0] : "",
          endtime: this.form.date.length ? this.form.date[1] : ""
        })
        .then(res => {
          console.log(res);
          this.totalnum = parseInt(_.get(res, "datalist.totalnum", 0));
          this.goodlist = _.get(res, "datalist.goodlist", []);
          console.log(this.goodlist);
        });
    },
    //返回编辑后的数据
    returnData(val) {
      console.log("返回的数据", val);
      if (Object.keys(val).length > 0) {
        console.log(val);
        this.alert.editProduct = false;
        this.getList(true);
      } else {
        console.log(22);
      }
    },
    //上下架
    upOrdown(row) {
      this.$axios
        .post(this.$location.updateGoodOnOrOffline, {
          ...row,
          status: row.status == 1 ? 2 : 1
        })
        .then(res => {
          this.$message(res.message);
          row.status = row.status == 1 ? 2 : 1;
        });
    },
    //编辑
    editRow(row) {
      this.$axios
        .post(this.$location.queryGoodsDetail, {
          ...row
        })
        .then(res => {
          console.log("haskjdfkas", res);
          this.other.returnForm = res.datalist.goodinfo;
          console.log("新出锅的:", this.other.returnForm);
          this.$nextTick(() => {
            this.alert.editProduct = true;
          });
        });
    },
    handleClick(row) {
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
.productList {
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
    .el-dialog__header {
      text-align: left;
    }
    .el-tabs__content {
      display: none;
    }
  }
}
</style>