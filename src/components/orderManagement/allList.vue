<template>
    <section class="allList">
        <!-- {{msg}} -->
        <main>
            <p>
                <span>商品信息</span>
                <em></em>
                <span>数量</span>
                <em></em>
                <span>单价(元)</span>
                <em></em>
                <span>实付金额(元)</span>
                <em></em>
                <span>交易状态</span>
                <em></em>
                <span>操作</span>
            </p>
            <section class="box"
                     v-for="(item,index) in 10"
                     :key="index">
                <div class="content">

                    <div>
                        <el-checkbox v-model="checked"></el-checkbox>
                        <img src="../../assets/img/home/111.jpg"
                             alt="">
                        <p>
                            <font>商品名称</font>
                            <span>
                                详情页的主要功能是传达产品信息及卖点，消除用户与产品之间的信息不对称。是以准确传达为准，而息及卖点，消除用户与产品之间的信息不对称。是以准确传达为准，而息及卖点，消除用户与产品之间的信息不对称。是以准确传达为准，而息及卖点，消除用户与产品之间的信息不对称。是以准确传达为准，而最终的销售转化更多在于用户对于产品功和价格的理性思考。
                            </span>
                        </p>
                    </div>
                    <div>2</div>
                    <div>55.00</div>
                    <div>110.00</div>
                    <div>
                        <el-button type="text">待付款</el-button>
                    </div>
                    <div>
                        <el-button type="text"
                                   @click="alert.info=true">查看详情</el-button>
                    </div>
                </div>
                <p><span>订单编号：2018102456465466545</span>
                    <span>下单时间：2018-10-24 12：25：36</span>
                    <span>收货人：斐丽</span>
                    <span>电话：13659998987</span>
                    <span>收货地址：浙江省杭州市滨江区江南大道滨盛路明豪大厦11楼1107室</span>
                </p>
                <section class="fen"></section>
            </section>
        </main>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page.sync="currentPage3"
                       :page-size="100"
                       layout="prev, pager, next, jumper"
                       :total="1000">
        </el-pagination>
        <el-dialog title="订单详情"
                   :visible.sync="alert.info"
                   width="60%"
                   custom-class="wai_dialog">
            <p>
                商品详情
            </p>
            <el-row>
                <el-col :span="12">
                    商品名称：商品名商品名商品名商品名商品名商品名
                </el-col>
                <el-col :span="12">
                    订单编号：2018102456465466545
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="12">
                    订单金额:88.00元
                </el-col>
                <el-col :span="12">
                    需支付金额： 88.00元
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    下单时间：2018-10-24 12：25：36
                </el-col>
                <el-col :span="12">
                    支付时间：2018-10-24 12：25：36
                </el-col>
            </el-row>
            <p>
                收货详情
            </p>
            <el-row>
                <el-col :span="12">
                    收货人：小时
                </el-col>
                <el-col :span="12">
                    收货人电话:13888888888
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    收货地址：浙江省杭州市滨江区江南大道滨盛路明豪大厦11楼1107室
                </el-col>
                <el-col :span="12">
                    <el-button type="text"
                               @click="alert.name=true">修改信息</el-button>
                </el-col>
            </el-row>
            <p>
                物流详情
            </p>
            <el-row>
                <el-col :span="12">
                    物流公司：顺丰快递
                </el-col>
                <el-col :span="12">
                    物流费用：20.00元
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    物流单号：569877885456565
                </el-col>
                <el-col :span="12">
                    <el-button type="text"
                               @click="alert.flowinfo=true">修改信息</el-button>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button @click="alert.info = false">取 消</el-button>
                <el-button type="primary"
                           @click="alert.info = false">确 定</el-button>
            </span>
            <el-dialog width="30%"
                       title="修改信息"
                       :visible.sync="alert.name==true||alert.flowinfo==true"
                       append-to-body
                       custom-class="nei_dialog"
                       :close-on-press-escape="false"
                       :show-close="false">
                <el-form :model="form">
                    <el-form-item v-if="alert.name==true"
                                  label="收货人"
                                  :label-width="formLabelWidth">
                        <el-input v-model="form.name"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="alert.name==true"
                                  label="收货人电话"
                                  :label-width="formLabelWidth">
                        <el-input v-model="form.name"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="alert.name==true"
                                  label="收货人地址"
                                  :label-width="formLabelWidth">
                        <el-input type="textarea"
                                  :rows="2"
                                  placeholder="请输入内容"
                                  v-model="form.name">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="alert.flowinfo==true"
                                  label="物流公司"
                                  :label-width="formLabelWidth">
                        <el-input v-model="form.name"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="alert.flowinfo==true"
                                  label="物流电话"
                                  :label-width="formLabelWidth">
                        <el-input v-model="form.name"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="alert.name = false;alert.flowinfo = false">取 消</el-button>
                    <el-button type="primary"
                               @click="alert.name = false;alert.flowinfo = false">确 定</el-button>
                </span>
            </el-dialog>

        </el-dialog>
    </section>
</template>
<script>
	export default{
		data(){
			return{
                    msg:'',
                    currentPage3:1,
                    alert:{
                        info:false,
                        name:false,
                        flowinfo:false

                    },
                    form: {
                        name: '',
                    },
                    formLabelWidth: '100px',
                    checked:''
			}
		},
		created(){
            this.$set(this,'msg',['','全部订单','待付款','待发货','待收货','已完成'][this.$route.query.id])
            
            console.log(this.$route.query.id)
		},
		methods:{
			 handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
        },
        watch: {
　　// 利用watch方法检测路由变化：
　　'$route': function (to, from) {
　　　　// 拿到目标参数 to.query.id 去再次请求数据接口
// 　　　　this.loadPageData(to.query.id)
console.log(to.query.id)
this.$set(this,'msg',['','全部订单','待付款','待发货','待收货','已完成'][this.$route.query.id])
　　}
}
	}
</script>
<style  lang="scss">
	.allList{
        width: 100%;
       position: relative;
       display: flex;
       flex-direction: column;
        main{
            //  max-width:1400px;
             overflow-y: auto;
            flex: 1;
           
            >p{
                //  width: 1500px;
                height: 40px;
                display: flex;
                align-items: center;
               color: #909399;
               font-weight: 500;
               font-size: 14px;
                span:not(:first-child){
                    flex: 1;
                }
                em{
                    border-left: 1px solid #eee;
                    height: 20px;
                }
                span:first-child{
                   width: 35%;


                }
                
            }
            .box{
                width: 100%;
                
                .fen{
                    height: 1px;
                    background: #eee;
                    margin-bottom: 20px;
                }
                .content{
                    width: 100%;
                    height: 100px;
                    display: flex;
                    div:not(:first-child){
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                     font-size: 14px;
                    }  
                    
                    div:first-child{
                        display: flex;
                        align-items: center;
                        width: 35%;
                        .el-checkbox{
                            margin-left: 10px;
                        }
                            img{
                                height: 80px;
                                width: 80px;
                                margin: 0 10px;
                            }
                            >p{
                                height: 80px;
                               flex: 1;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                font{
                                    text-align: left;
                                    font-weight: 500;
                                    font-size: 18px;
                                    color: #333;
                                }
                                span{
                                    @include no-wrap-line(2);
                                    text-align: justify;
                                    text-justify: newspaper;
                                    margin-right: 10px;
                                    font-size: 14px;
                                    color: #666;
                                }
                            }
                    }
                    
                }
                >p{
                    padding:  0 10px;
                    display: flex;
                    height: 45px;
                    font-size: 14px;
                    color: #333;
                    justify-content: space-between;
                    align-items: center;
                    border-top:1px solid #eee; 
                    span{
                        text-align: left;
                    }
                }
            }
        }
        .el-pagination{
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .wai_dialog{
            .el-dialog__header{
                text-align: left;
            }
            >.el-dialog__body{
                padding: 0 20px 30px; 
                >p{
                    text-align: left;
                    height: 45px;
                    line-height: 45px;
                    font-weight: 500;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 15px;
                }
                .el-col{
                    text-align: left;
                    @include no-wrap;
                    margin-bottom: 10px; 
                    >.el-button{
                        padding: 0;
                    }
                }
            }
            .nei_dialog{
                .el-form{
                    .el-input{
                        width: 250px;
                    }
                }
            }
        }
    }
</style>