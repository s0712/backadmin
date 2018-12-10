<template>
  <div id="app">
    <header>
      <img src="./assets/img/home/logo.png"
           alt="">
      <p> <img :src="user.avatar"
             alt=""><span>{{user.nickname}}</span>

      </p>
    </header>
    <section>
      <article>
        <el-menu default-active="1"
                 class="el-menu-vertical-demo"
                 @open="handleOpen"
                 @close="handleClose"
                 background-color="#2a3542"
                 text-color="#fff"
                 router
                 unique-opened>
          <el-submenu :index="item.menuid"
                      v-for="(item,index) in menulist"
                      :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(i,v) in item.submenulist"
                            :key="v"
                            :index="i.url">{{i.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/productList">商品列表</el-menu-item>
              <el-menu-item index="/addProduct">添加新商品</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/orderList">订单列表</el-menu-item>
              <el-menu-item index="/afterSaleList">售后管理</el-menu-item>
              <el-menu-item index="/appraiseList">评价管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>会员管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/memberList">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>财务管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/reportForms">财务报表</el-menu-item>
              <el-menu-item index="/moneyDetail">财务明细</el-menu-item>
              <el-menu-item index="/brokerageDetail">佣金明细</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/setCompany">公司管理</el-menu-item>
              <el-menu-item index="/setDepart">部门管理</el-menu-item>
              <el-menu-item index="/setUser">用户管理</el-menu-item>
              <el-menu-item index="/setRole">角色管理</el-menu-item>
              <el-menu-item index="/setMenu">菜单管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>客服管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/service">客服设置</el-menu-item>

            </el-menu-item-group>
          </el-submenu> -->

        </el-menu>

      </article>
      <main>
        <p><span>{{$route.meta.title?$route.meta.title:$route.matched[0]?$route.matched[0].meta.title:''}}</span></p>
        <div>
          <router-view class="view" />
        </div>

      </main>
    </section>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      menulist: [], //菜单列表
      user: {}
    };
  },
  computed: {
    ...mapState(["userinfo"])
  },
  created() {
    this.login();
  },
  methods: {
    //登录
    login() {
      let promise = new Promise(resolve => {
        let storage = window.localStorage;
        this.$axios
          .post(this.$location.dologin, {
            loginname: storage.loginname,
            password: storage.password
          })
          .then(data => {
            console.log(data);
            this.menulist = _.get(data, "datalist.menulist", []);
            this.user = _.get(data, "datalist.userinfo", {});
            console.log(this.menulist);
            if (data.status == 1) {
              this.$store.dispatch(
                "setUserMsg",
                _.get(data, "datalist.userinfo", {})
              );
              this.$store.dispatch(
                "setMenu",
                _.get(data, "datalist.menulist", [])
              );
              resolve(data.datalist);
            }
          });
      });
      this.$store.commit("toPrepare", promise);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped lang="scss" >
#app {
  //   border: 1px solid red;
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
  > header {
    background: #fff;
    display: flex;
    justify-content: space-between;
    > p {
      display: flex;
      align-items: center;
      padding-right: 10px;
      span {
        margin-left: 10px;
        font-weight: 500;
      }
      img {
        height: 45px;
        width: 45px;
      }
    }
  }
  > section {
    flex: 1;
    background: #2a3542;
    display: flex;
    article {
      width: 220px;
      flex-basis: 220px;
      .el-menu {
        width: 100%;
        border-right: none;
        text-align: left;
        .el-menu-item-group__title {
          padding: 0;
        }
      }
    }
    main {
      flex: 1;
      background: #fff;
      display: flex;
      flex-direction: column;
      > p {
        height: 35px;
        line-height: 35px;
        background-color: #35404d;
        text-align: left;
        span {
          color: #a2abb6;
          background-color: #415164;
          border-color: #415164;
          padding: 0px 3px 0px 6px;
          line-height: 22px;
          overflow: hidden;
          font-size: 12px;
          margin-left: 10px;
        }
      }
      > div {
        flex: 1;
        display: flex;
        //    border:1px solid blue;
        padding: 15px;

        background-color: #f1f2f7;
        > .view {
          //    border:1px solid red;
          flex: 1;
          border-radius: 5px;
          overflow-y: auto;
        }
        @media screen and (max-width: 800px) {
          > .view {
            overflow-x: auto;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 800px) {
  #app {
    overflow-x: auto;
    height: 100%;
  }
}
</style>
