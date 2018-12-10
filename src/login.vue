<template>
  <section class="login"
           id="login">
    <vue-particles color="#fff"
                   :particleOpacity="0.3"
                   :particlesNumber="60"
                   shapeType="circle"
                   :particleSize="4"
                   linesColor="#fff"
                   :linesWidth="1"
                   :lineLinked="true"
                   :lineOpacity="0.4"
                   :linesDistance="150"
                   :moveSpeed="2"
                   :hoverEffect="true"
                   hoverMode="grab"
                   :clickEffect="true"
                   clickMode="push"
                   class="lizi">
    </vue-particles>
    <div>
      <section class="content">
        <div class="right">
          <el-form :rules="rules"
                   class="form"
                   ref="form"
                   :model="form">
            <el-form-item prop="loginname">
              <el-input v-model="form.loginname"
                        placeholder="请输入用户名">
                <template slot="prepend"><i class="icon iconfont icon-ai-user"></i></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password"
                        placeholder="请输入密码"
                        v-model="form.password"
                        @keydown.enter.native="login">
                <template slot="prepend"><i class="icon iconfont icon-mima"></i></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="save">
              <el-checkbox v-model="form.save">记住密码</el-checkbox>
              <el-button type="primary"
                         @click="login">登 录</el-button>
            </el-form-item>

          </el-form>
        </div>
      </section>
    </div>
  </section>
</template>
<script>
import "./assets/iconfont/iconfont.css";
export default {
  data() {
    return {
      form: {
        loginname: "",
        password: "",
        save: ""
      },
      rules: {
        loginname: [
          {
            required: true,
            message: "请输入账号",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    this.form.loginname = window.localStorage["loginname"] || "";
    console.log();
    if (window.localStorage["save"]) {
      this.form.password = window.localStorage["password"] || "";
    }
  },
  methods: {
    //登录
    login() {
      window.localStorage["loginname"] = this.form.loginname;
      window.localStorage["password"] = this.form.password;
      window.localStorage["save"] = this.form.save;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.$location.dologin, {
              ...this.form
            })
            .then(res => {
              console.log(res);
              if (res.status == 1) {
                this.$message(res.message);
                this.$store.dispatch(
                  "setUserMsg",
                  _.get(res, "datalist.userinfo", {})
                );
                this.$store.dispatch(
                  "setMenu",
                  _.get(res, "datalist.menulist", {})
                );
              }
              setTimeout(() => {
                self.location = "/abc/";
              }, 1000);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .lizi {
    width: 100%;
    height: 100%;
    background: url("../src/assets/img/home/timg.jpeg") no-repeat;
    background-size: 100% 100%;
    position: absolute;
  }
  .content {
    z-index: 100;
    width: 500px;
    height: 460px;
    border-radius: 20px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
    opacity: 0.86;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      text-align: center;
      display: flex;
      flex-direction: column;
      .el-form-item__content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
  }
}
</style>