<template>
  <section class="addProduct">
    <public-head :msg="$route.meta.title"></public-head>
    <div class="view">
      <el-tabs tab-position="left"
               v-model="other.active">
        <el-tab-pane label="基本"
                     name="1">
        </el-tab-pane>
        <el-tab-pane label="图片"
                     name="2">
        </el-tab-pane>
        <el-tab-pane label="规格"
                     name="3">
        </el-tab-pane>
        <!-- <el-tab-pane label="参数">参数</el-tab-pane> -->
      </el-tabs>
      <div class="content">
        <el-form ref="form"
                 :model="form"
                 label-width="100px">
          <div class="section1"
               v-if="other.active==1">
            <el-form-item label="商品名称:"
                          prop="goodname">
              <el-input v-model="form.goodname"
                        placeholder="请输入商品名称"></el-input>
              <el-input v-model="form.unit"
                        style="width:150px"
                        placeholder="请输入商品单位"></el-input>

            </el-form-item>
            <el-form-item label="副标题:"
                          prop="futitle">
              <el-input v-model="form.futitle"
                        placeholder="请输入副标题"></el-input>
            </el-form-item>
            <el-form-item label="短标题:"
                          prop="shorttitle">
              <el-input v-model="form.shorttitle"
                        placeholder="请输入短标题"></el-input>
            </el-form-item>
            <el-form-item label="商品分类:"
                          prop="name">
              <el-cascader clearable
                           change-on-select
                           :options="paramsList.categorys"
                           v-model="form.categorys"
                           :props="categorysProps">
              </el-cascader>
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
                           :props="props">
              </el-cascader>

            </el-form-item>
            <el-form-item label="商品描述:"
                          prop="description">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.description">
              </el-input>
            </el-form-item>
          </div>
          <div class="section2"
               v-if="other.active==2">
            <el-form-item label="展示图:"
                          prop="mainphoto_temp">
              <el-upload :class="{'hideupload':form.mainphoto_temp.length>=1}"
                         :limit="1"
                         :action="$location.uploadFilePhoto"
                         list-type="picture-card"
                         :on-remove="(file,fileList)=>removePicture(file,fileList,'mainphoto_temp','mainphoto')"
                         :on-success="(response, file, fileList)=>handlePicture(response, file, fileList,'mainphoto_temp','mainphoto')"
                         :file-list="form.mainphoto_temp"
                         :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="轮播图:"
                          prop="lunbophotos_temp">
              <el-upload :class="{'hideupload':form.lunbophotos_temp.length>=6}"
                         :limit="6"
                         :action="$location.uploadFilePhoto"
                         list-type="picture-card"
                         :on-remove="(file,fileList)=>removePicture(file,fileList,'lunbophotos_temp','lunbophotos')"
                         :on-success="(response, file, fileList)=>handlePicture(response, file, fileList,'lunbophotos_temp','lunbophotos')"
                         :file-list="form.lunbophotos_temp"
                         :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="详情图:"
                          prop="showphotos_temp">
              <el-upload :class="{'hideupload':form.showphotos_temp.length>=6}"
                         :limit="6"
                         :action="$location.uploadFilePhoto"
                         list-type="picture-card"
                         :on-preview="(file)=>handlePictureCardPreview(file,'showphotos_temp')"
                         :on-remove="(file,fileList)=>removePicture(file,fileList,'showphotos_temp','showphotos')"
                         :on-success="(response, file, fileList)=>handlePicture(response, file, fileList,'showphotos_temp','showphotos')"
                         :file-list="form.showphotos_temp"
                         :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </div>
          <div class="section3"
               v-if="other.active==3">
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
                        style="width:90%;max-width:1024px;"
                        height="250">
                <el-table-column fixed="left"
                                 prop="propvalues"
                                 label="规格"
                                 width="300">

                </el-table-column>

                <el-table-column prop="goodssn"
                                 label="商品编码"
                                 width="200"
                                 :render-header="(h,obj)=>renderheader(h,obj,'goodssn')">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.goodssn "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productsn"
                                 label="商品条码"
                                 width="200"
                                 :render-header="(h,obj)=>renderheader(h,obj,'productsn')">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.productsn "></el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="productprice"
                                 label="价格"
                                 width="200"
                                 :render-header="(h,obj)=>renderheader(h,obj,'productprice')">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.productprice "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="totalnum"
                                 label="库存"
                                 width="200"
                                 :render-header="(h,obj)=>renderheader(h,obj,'totalnum')">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.totalnum "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="showsalenum"
                                 label="销售数量"
                                 width="200"
                                 :render-header="(h,obj)=>renderheader(h,obj,'showsalenum')">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.showsalenum "></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="weight"
                                 label="商品重量(kg)"
                                 width="200"
                                 :render-header="(h,obj)=>renderheader(h,obj,'weight')">
                  <template slot-scope="scope">
                    <el-input type="number"
                              v-model="scope.row.weight "></el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="status_temp"
                                 label="SKU上下架"
                                 width="200">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.status_temp"
                               active-color="#13ce66"
                               inactive-color="#ff4949">
                    </el-switch>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination v-if="form.skugoodlist.length"
                             @current-change="handleCurrentChange"
                             :current-page.sync="currentPage"
                             :page-size="10"
                             layout="prev, pager, next, jumper"
                             :total="form.skugoodlist.length">
              </el-pagination>
            </div>
          </div>

        </el-form>
      </div>

    </div>
    <p class="subBtn">
      <el-button type="primary"
                 round
                 @click="addData">保存并发布</el-button>
    </p>
    <el-dialog width="70%"
               :visible.sync="alert.dialogVisible">
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
import publicHead from "../publicComponent/publicHead";
import addressArr from "../../assets/js/province.js";
import { setTimeout } from "timers";
import { VueCropper } from "vue-cropper";

export default {
  data() {
    return {
      currentPage: 1,
      //  fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

      props: {
        //商品所在地级联属性
        value: "name",
        children: "cityList",
        label: "name"
      },
      categorysProps: {
        //商品分类级联属性
        value: "cateid",
        children: "subcategorys",
        label: "catename"
      },
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
      arr: {
        addressArr: [],
        addFormItem: [
          //动态添加商品规格表单
        ]
      },
      alert: {
        //弹窗相关
        dialogVisible: false, //预览图片弹窗
        dialogImageUrl: "", //预览图片路径
        addattr: false, //添加商品属性值弹窗
        dialogImgCropperType: "" //被裁剪的图片属性是什么
      },
      other: {
        //其他
        active: "1", //tab
        newAttrValue: "", //新增商品属性值
        option: {
          img: "",
          size: 1,
          outputType: "jpeg",
          autoCropWidth: 200,
          autoCropHeight: 1000,
          fixedBox: true,
          centerBox: true
        }
      },
      paramsList: {
        //规格参数列表
        categorys: [] //商品分类
      },
      rules: {}
    };
  },
  components: {
    publicHead,
    VueCropper
  },
  created() {
    console.log(location);
    this.arr.addressArr = addressArr;
    this.resetForm = _.cloneDeep(this.form);
    new Promise((resolve, reject) => {
      this.getProductParams(resolve);
    }).then(res => {
      //   console.log(res.categorys);
      this.form.categorys = this.chooseCategorys(res.categorys);
    });
    // this.changeSKUdata()
  },
  methods: {
    //默认选中商品分类第一个
    chooseCategorys(data) {
      let temp = [];
      temp.push(data[0].cateid);
      if (data[0].subcategorys.length) {
        temp.push(data[0].subcategorys[0].cateid);
        if (data[0].subcategorys[0].subcategorys.length) {
          temp.push(data[0].subcategorys[0].subcategorys[0].cateid);
        } else {
          return temp;
        }
      }
      return temp;
    },
    //勾选规格属性改变sku表格数据
    changeSKUdata() {
      this.form.skugoodlist = [];
      let chooseArr = this.arr.addFormItem
        .filter(d => {
          return d.choose.length > 0;
        })
        .map(d => d.choose);
      //组合规格属性
      let temp;
      if (chooseArr.length == 1) {
        console.log("chooseArr为1");
        temp = chooseArr.shift();
      } else {
        console.log("chooseArr为多");
        temp = chooseArr.shift();
        console.log(temp);
        for (var i = chooseArr.length; i > 0; i--) {
          temp = this.duplicate(temp, chooseArr.shift());
        }
      }

      console.log(temp);

      this.arr.addFormItem.map(d => {
        this.$set(d, "specifpropvalue", d.choose.join(","));
      });

      //    console.log(this.arr.addFormItem)
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
        this.form.skugoodlist.push(obj_temp);
      });

      console.log(temp, this.form.skugoodlist);
    },
    duplicate(c1, c2) {
      let aa = [];
      for (var i = 0; i < c1.length; i++) {
        for (var j = 0; j < c2.length; j++) {
          aa.push(c1[i] + "|" + c2[j]);
        }
      }
      return aa;
    },
    //动态添加商品规格属性名
    addFormItemValue() {
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
    //获取商品参数列表
    getProductParams(resolved) {
      this.axios.post(this.$location.getProductParams).then(res => {
        this.paramsList = _.get(res, "datalist", {});

        // console.log(this.paramsList);
        // console.log(this.paramsList.categorys);
        resolved(this.paramsList);
      });
    },
    //渲染sku列表头
    renderheader(h, { column }, columnName) {
      console.log(columnName);
      return h("div", [
        h("span", column.label),
        h("el-input", {
          style: "margin-left: 5px;width:100px",
          attrs: {
            type: "number"
          },
          on: {
            change: value => {
              this.form.skugoodlist.map(d => {
                this.$set(d, columnName, value);
              });
            }
          }
        })
      ]);
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
    //获取图片
    handlePicture(response, file, fileList, arr, str) {
      //   console.log(fileList);
      this.handlePictureCardPreview(file, arr);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    //保存并发布商品
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
      this.form.skugoodlist.map(d => {
        d.status_temp == true ? (d.status = 1) : (d.status = 2);
      });
      this.axios
        .post(this.$location.addnewproduct, {
          ...this.form,
          specifications: this.arr.addFormItem,
          property: this.form.property.join(","),
          labels: this.form.labels.join(","),
          categorys: this.form.categorys.join(","),
          placeaddress: this.form.placeaddress.join(",")
        })
        .then(res => {
          this.$message(res.message);
          this.form = _.cloneDeep(this.resetForm);
        });
      console.log(this.form);
    }
  }
};
</script>
<style lang="scss">
.addProduct {
  height: 100%;
  padding: 0 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .view {
    flex: 1;
    display: flex;

    .el-tabs {
      height: 100%;
      display: flex;
      flex-direction: row;
      .el-tabs__header {
        width: 220px !important;
      }
      .el-tabs__content {
        display: none;
      }
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      .el-form {
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
      }
    }
    .img_content {
      //   border:1px solid green;
      .el-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        .el-form-item {
          flex: 1;
        }
      }
    }
    .tb_content {
      .el-form {
        flex: 1;
        min-height: 300px;
        overflow-y: auto;
        .el-checkbox-group {
          text-align: left;
        }
      }
      .addbtn {
        margin-left: 15px;
      }
      .el-table {
        flex: 2;
        margin: 0 auto;
        // width: 100%;
        th {
          > .cell div {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .subBtn {
    height: 80px;
    line-height: 100px;
  }
  .el-dialog {
    .el-dialog__body {
      .vue-cropper {
        height: 500px;
        overflow: auto;
      }
    }
  }
}
</style>