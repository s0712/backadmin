<template>
  <section class="editProduct">
    <el-dialog title="编辑图片"
               :visible.sync="show"
               width="70%"
               center
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false">
      <el-tabs v-model="other.activeName"
               tab-position="left"
               style="height: 200px;">
        <el-tab-pane label="基本"
                     name="1"></el-tab-pane>
        <el-tab-pane label="图片"
                     name="2"></el-tab-pane>
        <el-tab-pane label="规格"
                     name="3"></el-tab-pane>
      </el-tabs>
      <main>
        <el-form ref="form"
                 :model="form"
                 label-width="100px">
          <section v-if="other.activeName==1">
            <el-form-item label="商品分类:"
                          prop="name">
              <span>水果生鲜/水果蔬菜/时令水果</span>
            </el-form-item>
            <el-form-item label="商品名称:"
                          prop="goodname">
              <el-input v-model="form.goodname"
                        placeholder="请输入商品名称"></el-input>
              <el-input v-model="form.unit"
                        style="width:150px"
                        placeholder="请输入商品单位"></el-input>
            </el-form-item>
            <el-form-item label="商品类型:"
                          prop="goodtype">
              <el-radio v-for="(item,index) in paramsList.goodtypes"
                        :key="index"
                        v-model="form.goodtype"
                        :label="item.typeid">{{item.typename}}</el-radio>
            </el-form-item>
            <el-form-item label="商品属性:"
                          prop="property">
              <el-checkbox-group v-model="form.property">
                <el-checkbox v-for="(item,index) in paramsList.goodspropertys"
                             :key="index"
                             :label="item.propertyid">{{item.propertyname}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="商品标签:"
                          prop="labels">
              <el-checkbox-group v-model="form.labels">
                <el-checkbox v-for="(item,index) in paramsList.goodslabels"
                             :key="index"
                             :label="item.labelid">{{item.labelname}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="商品价格:"
                          prop="productprice">
              <el-input type="number"
                        v-model="form.productprice"
                        placeholder="销售价"></el-input>
              <el-input type="number"
                        v-model="form.costprice"
                        placeholder="进价"></el-input>
              <el-input type="number"
                        v-model="form.marketprice"
                        placeholder="市场价"></el-input>
            </el-form-item>
            <el-form-item label="商品所在地:"
                          prop="placeaddress">
              <el-cascader clearable
                           expand-trigger="hover"
                           :options="arr.addressArr"
                           v-model="form.placeaddress"
                           :props="other.props">
              </el-cascader>
            </el-form-item>
          </section>
          <section v-if="other.activeName==2">
            <el-form-item label="展示图:"
                          prop="mainphoto">
              <el-upload :class="{'hideupload':form.mainphoto_temp.length>=1}"
                         :limit="1"
                         :action="$location.uploadFilePhoto"
                         list-type="picture-card"
                         :on-remove="(file,fileList)=>removePicture(file,fileList,'mainphoto_temp','mainphoto')"
                         :on-success="(response, file, fileList)=>handlePictureCardPreview(file, 'mainphoto_temp')"
                         :file-list="form.mainphoto_temp">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="轮播图:"
                          prop="lunbophotos">
              <el-upload :class="{'hideupload':form.lunbophotos_temp.length>=6}"
                         :limit="6"
                         :action="$location.uploadFilePhoto"
                         list-type="picture-card"
                         :on-remove="(file,fileList)=>removePicture(file,fileList,'lunbophotos_temp','lunbophotos')"
                         :on-success="(response, file, fileList)=>handlePictureCardPreview(file, 'lunbophotos_temp')"
                         :file-list="form.lunbophotos_temp">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="详情图:"
                          prop="showphotos">
              <el-upload :class="{'hideupload':form.showphotos_temp.length>=6}"
                         :limit="6"
                         :action="$location.uploadFilePhoto"
                         list-type="picture-card"
                         :on-remove="(file,fileList)=>removePicture(file,fileList,'showphotos_temp','showphotos')"
                         :on-success="(response, file, fileList)=>handlePictureCardPreview(file, 'showphotos_temp')"
                         :file-list="form.showphotos_temp">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </section>
          <section v-if="other.activeName==3">
            <div class="head">
              <el-form-item label="商品规格:"
                            prop="name">
                <el-select v-model="form.specificationsValue_temp"
                           clearable
                           placeholder="请选择商品规格">
                  <el-option v-for="(item,index) in paramsList.specifications"
                             :key="index"
                             :label="item.specifname"
                             :value="item.specifid">
                  </el-option>
                </el-select>
                <el-button type="primary"
                           class="addbtn"
                           @click="addAttr">添加属性</el-button>
              </el-form-item>
              <!-- 动态添加商品规格属性表单 -->
              <el-form-item v-for="(item,index) in arr.addFormItem"
                            :key="index"
                            :label="item.specifname">
                <el-checkbox-group v-model="item.choose">
                  <el-checkbox v-for="(i,index) in item.temp_specifpropvalue"
                               :key="index"
                               :label="i"
                               @change="changeSKUdata">{{i}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="table">
              <el-table :data="form.skugoodlist"
                        border
                        style="width:100%;max-width:1024px;"
                        height="350">
                <el-table-column fixed="left"
                                 prop="propvalues"
                                 label="规格"
                                 width="300">

                </el-table-column>

                <el-table-column prop="goodssn"
                                 label="商品编码"
                                 width="250">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.goodssn "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productsn"
                                 label="商品条码"
                                 width="250">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.productsn "></el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="productprice"
                                 label="价格"
                                 width="250">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.productprice "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="totalnum"
                                 label="库存"
                                 width="250">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.totalnum "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="showsalenum"
                                 label="销售数量"
                                 width="250">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.showsalenum "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="weight"
                                 label="商品重量(g)"
                                 width="250">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.weight "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="status_temp"
                                 label="状态"
                                 width="200">
                  <template slot-scope="scope">
                    <span>{{['','上架','下架','已删除'][scope.row.status]}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status_temp"
                                 label="SKU上下架"
                                 width="200">
                  <template slot-scope="scope">
                    <el-button @click="switchUpdate(scope.row)"
                               type="text"
                               size="small">{{scope.row.status==1?'下架':'上架'}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination v-if="form.skugoodlist.length"
                             @current-change="handleCurrentChange"
                             :current-page.sync="other.currentPage"
                             :page-size="10"
                             layout="prev, pager, next, jumper"
                             :total="form.skugoodlist.length">
              </el-pagination>
            </div>
          </section>
        </el-form>
      </main>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="show = false;$emit('returnData',{})">取 消</el-button>
        <el-button type="primary"
                   @click="show = false;addData()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog width="70%"
               :visible.sync="alert.dialogVisible"
               custom-class="cropper">
      <vue-cropper ref="cropper"
                   :img="other.option.img"
                   :outputSize="other.option.size"
                   :outputType="other.option.outputType"
                   :full="true"
                   :canScale="false"
                   :autoCrop="true"
                   :fixedBox="true"
                   :centerBox="true"
                   :original="true"
                   :infoTrue="true"
                   :autoCropWidth="other.option.autoCropWidth"
                   :autoCropHeight="other.option.autoCropHeight"></vue-cropper>
      <!-- <img width="100%"
           :src="alert.dialogImageUrl"
           alt=""> -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="startcrop()">确 定</el-button>

      </span>
    </el-dialog>
    <el-dialog title="添加商品属性值"
               :visible.sync="alert.addattr"
               width="30%">
      <el-input v-model="other.newAttrValue"
                placeholder="请输入商品属性值"></el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="alert.addattr = false;other.newAttrValue=null">取 消</el-button>
        <el-button type="primary"
                   @click="alert.addattr = false;addFormItemValue()">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import addressArr from "../../assets/js/province.js";
import { VueCropper } from "vue-cropper";
export default {
  props: ["returnForm", "paramsList"], //返回的item
  data() {
    return {
      show: false,
      form: {
        specificationsValue_temp: "", //选中商品规格Id
        goodname: "", //商品名称
        unit: "", //商品单位
        status: 1, //商品状态 1上架商品  2下架商品 3删除  该接口默认传1
        goodtype: "", //商品类型 1实体商品  2虚拟商品
        futitle: "", //商品副标题
        shorttitle: "", //商品短标题
        property: [], //1推荐 2新品 3热卖 4包邮 5不参与会员折扣,多个以逗号隔开
        labels: [], //1正品保证 2 7天无理由退换 3保修 多个以逗号隔开
        description: "", //商品描述
        content: "", //商品详情内容
        categorys: [], //商品分类
        seccategory: "", //商品二级分类
        thirdcategory: "", //商品三级分类
        mainphoto: [], //首页展示商品图片
        lunbophotos: [], //商品详情页面 轮播图
        showphotos: [], //商品详情页面 详情图
        mainphoto_temp: [], //首页展示商品图片
        lunbophotos_temp: [], //商品详情页面 轮播图
        showphotos_temp: [], //商品详情页面 详情图
        productprice: "", //商品销售价格
        marketprice: "", //商品市场价格
        costprice: "", //商品成本价格
        originalprice: "", //商品原来价格
        province: "", //商品产地 省份
        city: "", //商品产地 城市
        placeaddress: [], //商品所在地
        params: "", //商品参数
        specifications: [], //商品规格数组
        skugoodlist: [], //商品SKU列表数据
        token: "", //后台管理员用户用户登陆会话唯一标识
        lantype: "" //语言类型，返回手机设置的语言
      },
      alert: {
        //弹窗相关
        dialogVisible: false, //预览图片弹窗
        dialogImageUrl: "", //预览图片路径
        addattr: false, //添加商品属性值弹窗
        dialogImgCropperType: "" //被裁剪的图片属性是什么
      },
      other: {
        activeName: "1", //tab位置
        props: {
          //商品所在地级联属性
          value: "name",
          children: "cityList",
          label: "name"
        },
        option: {
          img: "",
          size: 1,
          outputType: "jpeg",
          autoCropWidth: 200,
          autoCropHeight: 1000,
          fixedBox: true,
          centerBox: true
        },
        currentPage: 1
      },
      arr: {
        addressArr: [], //商品所在地
        addFormItem: [
          //动态添加商品规格表单
        ]
      }
    };
  },
  components: {
    VueCropper
  },
  created() {
    // this.getProductParams();
    this.show = true;
    console.log(11111, this.returnForm);
    Object.assign(this.form, this.returnForm);
    //商品所在地
    this.form = this.dealData(this.form);
    console.log(this.form, this.form.skugoodlist);
    this.arr.addressArr = addressArr;
    // console.log(this.arr.addressArr)
  },
  methods: {
    dealData(data) {
      data.placeaddress = [data.province, data.city, data.area];
      data.property = data.property.split(",");
      data.labels = data.labels.split(",");
      data.goodtype = parseInt(data.goodtype);
      data.mainphoto.split(",").map(d => {
        let obj = {
          url: this.$location.showimgURL + d
        };
        data.mainphoto_temp.push(obj);
      });
      data.lunbophotos.split(",").map(d => {
        let obj = {
          url: this.$location.showimgURL + d
        };
        data.lunbophotos_temp.push(obj);
      });
      data.showphotos.split(",").map(d => {
        let obj = {
          url: this.$location.showimgURL + d
        };
        data.showphotos_temp.push(obj);
      });

      data.specifications.map(d => {
        let temp = this.paramsList.specifications.filter(
          i => i.specifid == d.specifid
        );
        this.$set(temp[0], "choose", d.specifpropvalue.split(","));
        this.$set(temp[0], "temp_specifpropvalue", []);
        if (temp[0].ishavevalues) {
          this.$set(temp[0], "temp_specifpropvalue", temp[0].specifpropvalue);
        } else {
          temp[0].temp_specifpropvalue = d.specifpropvalue.split(",");
        }
        this.arr.addFormItem.push(...temp);
      });

      console.log(this.arr.addFormItem);
      return data;
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
    //确定截图
    startcrop() {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        // do something
        // console.log(data);
        this.$set(this.other.option, "img", data);
        this.$axios
          .post(this.$location.uploadBase64Photo, {
            photobase: data
          })
          .then(res => {
            console.log(res);
            let obj = {
              url: this.$location.showimgURL + res.datalist.photoname || ""
            };
            this.form[this.alert.dialogImgCropperType].push(obj);
            console.log(this.form[this.alert.dialogImgCropperType]);
            this.alert.dialogVisible = false;
          });
      });
    },
    //预览图片
    handlePictureCardPreview(file, arr) {
      this.other.option.img = file.url;
      this.alert.dialogVisible = true;
      this.alert.dialogImgCropperType = arr;
      if (arr == "mainphoto_temp") {
        //展示图710*320px    轮播主图750*750px   商品详情图宽度750px长度不限，上传图片均≤4M
        this.$set(this.other.option, "autoCropWidth", 710);
        this.$set(this.other.option, "autoCropHeight", 320);
      } else if (arr == "lunbophotos_temp") {
        this.$set(this.other.option, "autoCropWidth", 750);
        this.$set(this.other.option, "autoCropHeight", 750);
      } else {
        this.$set(this.other.option, "autoCropWidth", 750);
        this.$set(this.other.option, "autoCropHeight", 1000);
      }
    },
    //删除图片
    removePicture(file, fileList, arr, str) {
      this.form[arr] = fileList;
      this.form[str] = fileList
        .map(d => {
          return d.url;
        })
        .join(",");
    },
    //勾选规格属性改变sku表格数据
    changeSKUdata(val) {
      let checkboxValue = val;
      console.log(val);
      let chooseArr = this.arr.addFormItem
        .filter(d => {
          return d.choose.length > 0;
        })
        .map(d => d.choose);
      console.log(chooseArr);
      let temp;
      if (chooseArr.length == 1) {
        temp = chooseArr.shift();
      } else {
        temp = chooseArr.shift();
        for (var i = chooseArr.length; i > 0; i--) {
          temp = this.duplicate(temp, chooseArr.shift());
        }
      }
      console.log(temp);
      this.arr.addFormItem.map(d => {
        this.$set(d, "specifpropvalue", d.choose.join(","));
      });
      console.log(this.form.skugoodlist);
      //checkboxValue为true 为添加,否则为删
      if (checkboxValue) {
        // 动态添加表格数据
        temp.map(d => {
          let obj_temp = {
            //sku列表属性
            propvalues: "", //属性组组合以|分割例如黄色|X, 白色|M
            goodssn: "", //SKU商品编码
            productsn: "", //SKU商品条码
            productprice: "", //SKU商品销售价格
            totalnum: "", //SKU商品库存
            showsalenum: "", //SKU商品显示的销售数量
            weight: "", //SKU商品的重量
            status_temp: true, //true,上架 false 下架
            status: "" //SKU商品状态 1上架商品  2下架商品
          };
          obj_temp.propvalues = d;
          let isHave = _.findIndex(this.form.skugoodlist, { propvalues: d });
          if (isHave < 0) {
            this.form.skugoodlist.push(obj_temp);
          }
        });
      } else {
        console.log(temp);
        this.form.skugoodlist.map(d => {
          let isHave = _.indexOf(temp, d.propvalues);
          console.log(isHave);
          isHave < 0 ? (d.delete = true) : (d.delete = false);
        });
        this.form.skugoodlist = this.form.skugoodlist.filter(d => {
          return !d.delete;
        });
        console.log(this.form.skugoodlist);
      }

      console.log(temp, this.form.skugoodlist);
    },
    duplicate(c1, c2) {
      let arr = [];
      for (var i = 0; i < c1.length; i++) {
        for (var j = 0; j < c2.length; j++) {
          arr.push(c1[i] + "|" + c2[j]);
        }
      }
      return arr;
    },
    //动态添加商品规格属性名
    addFormItemValue() {
      console.log();
      let isformHave = this.arr.addFormItem.filter(
        d => d.specifid == this.form.specificationsValue_temp
      );
      //判断是否新增规格表单中是否有该选项
      //如果没有,直接添加,
      if (Object.keys(isformHave).length == 0) {
        let temp = this.paramsList.specifications.filter(
          d => d.specifid == this.form.specificationsValue_temp
        );
        this.$set(temp[0], "choose", []);
        this.$set(temp[0], "temp_specifpropvalue", []);
        temp[0].temp_specifpropvalue.push(this.other.newAttrValue);
        this.arr.addFormItem.push(...temp);
      } else {
        // 如果有,判断该新增属性值是否存在
        let isHaveattr = isformHave[0].temp_specifpropvalue.indexOf(
          this.other.newAttrValue
        );
        if (isHaveattr < 0) {
          this.arr.addFormItem.map(d => {
            if (d.specifid == isformHave[0].specifid) {
              d.temp_specifpropvalue.push(this.other.newAttrValue);
            }
          });
        } else {
          this.$message("已经添加过该商品规格属性值,不允许重复添加!");
        }
      }
      this.other.newAttrValue = null;
    },
    //添加规格属性按钮点击时间
    addAttr() {
      let temp = this.paramsList.specifications.filter(
        d => d.specifid == this.form.specificationsValue_temp
      );
      //    如果属性有属性值,直接显示否则添加
      if (temp[0].ishavevalues) {
        // 判断新增的属性是否已经被添加过,如果有不允许添加
        let isformHave = this.arr.addFormItem.filter(
          d => d.specifid == this.form.specificationsValue_temp
        );
        if (Object.keys(isformHave).length == 0) {
          this.$set(temp[0], "choose", []);
          this.$set(temp[0], "temp_specifpropvalue", temp[0].specifpropvalue);
          this.arr.addFormItem.push(...temp);
        } else {
          this.$message("已经添加过该商品规格,不允许重复添加!");
        }
      } else {
        this.alert.addattr = true;
      }
    },

    //确认
    addData() {
      this.form.mainphoto = this.form.mainphoto_temp
        .map(d => {
          let temp = d.url.split(".net/");
          return temp[1];
        })
        .join(",");
      this.form.lunbophotos = this.form.lunbophotos_temp
        .map(d => {
          let temp = d.url.split(".net/");
          return temp[1];
        })
        .join(",");
      this.form.showphotos = this.form.showphotos_temp
        .map(d => {
          let temp = d.url.split(".net/");
          return temp[1];
        })
        .join(",");
      this.$axios
        .post(this.$location.updateProductInfo, {
          ...this.form
        })
        .then(res => {
          this.$message(res.message);
          this.$emit("returnData", this.form);
        });
    },
    //更新单条sku数据上下架switchUpdate
    switchUpdate(row) {
      this.$axios
        .post(this.$location.updateSKUOnOrOffline, {
          ...row,
          status: row.status == 1 ? 2 : 1
        })
        .then(res => {
          this.$message(res.message);
          row.status = row.status == 1 ? 2 : 1;
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style  lang="scss">
.editProduct {
  .el-dialog {
    margin-top: 6vh;
    .el-dialog__header {
      text-align: left;
    }
    .el-dialog__body {
      display: flex;
      .el-tabs__content {
        display: none;
      }
      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 500px;
        max-height: 700px;
        overflow-y: auto;

        .el-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          //   border:1px solid red;
          width: 90%;
          max-width: 1024px;
          margin: 0 auto;
          .el-form-item {
            display: flex;
            .el-form-item__content {
              flex: 1;
              display: flex;
              margin-left: 10px !important;
              .el-input,
              .el-select,
              .el-cascader {
                flex: 1;
              }
              .el-radio {
                display: flex;
                align-items: center;
              }
              .hideupload {
                .el-upload {
                  display: none;
                }
              }
            }
          }
          .el-form-item:first-child {
            .el-select {
              max-width: 200px;
            }
          }
          > section {
            //   border:1px solid blue;
            .head {
              // border:1px solid red;
            }
            > .table {
              //   border:1px solid green;
              .el-table th div {
                display: flex;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }
  .cropper {
    .el-dialog__body {
      .vue-cropper {
        height: 500px;
        overflow: auto;
      }
    }
  }
}
</style>