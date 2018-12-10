<template>
  <section class="imlist">
    <section class="im"
             id="scrolldIV">
      <li :class="{'item':true,'left':item.type==1,'right':item.type==0}"
          v-for="(item,index) in other.useritem.imlist"
          :key="index">
        <img :src="item.headimgurl"
             alt="">

        <!-- <span v-if="index%2==0">:小p</span> -->
        <p>{{item.content}}</p>
      </li>
    </section>
    <section class="content">
      <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="textarea3"
                @keyup.enter.native="submit">
      </el-input>
    </section>
  </section>
</template>
<script>
export default {
  props: ["userid", "serviceuserid", "useritem"],
  data() {
    return {
      textarea3: "",
      arr: {
        imList: []
      },
      other: {
        userid: "", //用户userid
        serviceuserid: "", //客服userid
        useritem: {} // //被选中的用户
      }
    };
  },
  watch: {
    useritem(val) {
      //   console.log("123", val.imlist);
      this.other.useritem = _.clone(val);
      console.log(this.other.useritem);
      this.getData();
      this.openWS(this);
      this.scrollToBottom();
    }
  },
  created() {
    //被选中的聊天用户
  },
  methods: {
    //如果是当前用户发送的消息追加  如果是其他人发送的 追加到父级列表
    openWS(t) {
      //   console.log(this.$parent);
      this.$parent.websocket.onmessage = function(evt) {
        console.log(t);
        let d = JSON.parse(evt.data);
        if (d.userid == t.other.useritem.userid) {
          t.other.useritem.imlist.push(d);
        } else {
          let p = t.$parent.arr.personArr.filter(l => l.userid == d.userid);
          if (p.length) {
            p[0].imlist.push(d);
          } else {
            //如果没有
            d.imlist = [d];
            t.$parent.arr.personArr.push(d);
          }
        }
        t.scrollToBottom();
      };
    },
    scrollToBottom() {
      this.$nextTick(() => {
        var container = this.$el.querySelector("#scrolldIV");
        container.scrollTop = container.scrollHeight;
      });
    },

    getData() {
      this.$axios
        .post(this.$location.queryUserChatRecords, {
          userid: this.other.useritem.touserid,
          touserid: this.other.useritem.userid
        })
        .then(res => {
          console.log(res);
          this.other.useritem.imlist = _.get(
            res,
            "datalist.charRecords",
            []
          ).concat(this.other.useritem.imlist);
        });
    },
    submit() {
      if (this.textarea3 == "\n") {
        this.$message({
          type: "error",
          message: "回复消息不可为空!"
        });
        return false;
      }
      let obj = {
        flag: 1,
        content: this.textarea3,
        headimgurl: this.other.useritem.toheadimgurl,
        nickname: this.other.useritem.tonickname,
        userid: this.other.useritem.touserid,
        toheadimgurl: this.other.useritem.headimgurl,
        tonickname: this.other.useritem.nickname,
        touserid: this.other.useritem.userid,
        chattime: this.moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        type: 0
      };
      this.other.useritem.imlist.push(obj);

      this.$parent.websocket.send(JSON.stringify(obj));
      this.textarea3 = "";
      this.getData();
    }
  }
};
</script>
<style  lang="scss">
.imlist {
  border: 1px solid #eee;
  width: 700px;
  display: flex;
  flex-direction: column;
  .im {
    height: 70%;
    padding: 0 15px;
    list-style: none;
    overflow-y: auto;
    img {
      height: 40px;
      width: 40px;
    }
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      > p {
        flex: 1;
        margin: 10px;
      }
    }
    .left {
      text-align: left;
      span {
        margin-left: 5px;
      }
    }
    .right {
      flex-direction: row-reverse;
      span {
        margin-right: 5px;
      }
      > p {
        text-align: right;
      }
    }
  }
  .content {
    flex: 1;
    border-top: 1px solid #eee;
    display: flex;
    .el-textarea {
      flex: 1;
      display: flex;
      flex-direction: column;
      .el-textarea__inner {
        flex: 1;
      }
    }
  }
}
</style>