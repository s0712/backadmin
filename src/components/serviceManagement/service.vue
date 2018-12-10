<template>
  <section class="service">
    <public-head :msg="$route.meta.title"></public-head>
    <main>
      <article>
        <p class="title"><img :src="obj.serviceuser.headimgurl"
               alt="">客服人员:{{obj.serviceuser.nickname}}</p>
        <li :class="{'item':true,'active':other.activeIndex==index}"
            v-for="(item,index) in arr.personArr"
            :key="index"
            @click="showRecord(item);other.activeIndex=index">
          <p><img :src="item.headimgurl"
                 alt=""><span>{{item.nickname}}</span></p>

          <!-- <font>{{index+1}}</font> -->
        </li>
      </article>
      <imlist :userid="other.userid"
              :useritem="other.useritem"
              :serviceUserid="other.serviceuserid"></imlist>
    </main>
  </section>
</template>
<script>
import publicHead from "../publicComponent/publicHead";
import imlist from "./imlist";
export default {
  data() {
    return {
      obj: {
        serviceuser: {}
      },
      arr: {
        personArr: []
      },
      other: {
        activeIndex: null,
        userid: "",
        serviceuserid: "",
        useritem: {}
      }
    };
  },
  components: {
    publicHead,
    imlist
  },
  created() {
    this.getData();
  },
  methods: {
    //获取客服信息
    getData() {
      this.$axios.post(this.$location.queryServiceUserInfo).then(res => {
        this.obj.serviceuser = _.get(res, "datalist.serviceUser", {});
        this.createWS(this);
        // this.getRecords();
      });
    },
    //获取聊天记录
    // getRecords() {
    //   this.$axios
    //     .post(this.$location.queryUserChatRecords, {
    //       userid: this.obj.serviceuser.userid
    //     })
    //     .then(res => {
    //       let temp = _.get(res, "datalist.charRecords", []);
    //       //将相同userid分类
    //       temp.map(d => {
    //         let p = this.arr.personArr.filter(l => l.userid == d.userid);
    //         //如果有
    //         if (p.length) {
    //           p[0].imlist.push(d);
    //         } else {
    //           //如果没有
    //           d.imlist = [d];
    //           this.arr.personArr.push(d);
    //         }
    //       });
    //       console.log(this.arr.personArr);
    //     });
    // },
    createWS(data) {
      this.wsServer = "ws://47.99.85.153:9506"; //服务器地址
      this.websocket = new WebSocket(this.wsServer); //创建WebSocket对象
      // websocket.send("hello"); //向服务器发送消息
      console.log(this.websocket.readyState); //查看websocket当前状态
      this.websocket.onopen = function(evt) {
        let obj = {
          flag: 0,
          userid: data.obj.serviceuser.userid || ""
        };
        // console.log(this);
        this.send(JSON.stringify(obj));
        // console.log(evt);
        //已经建立连接
      };
      this.websocket.onclose = function(evt) {
        //已经关闭连接
      };
      this.websocket.onmessage = function(evt) {
        // console.log(JSON.parse(evt.data));
        console.log(data);
        let d = JSON.parse(evt.data);
        // data.arr.personArr.push();
        let p = data.arr.personArr.filter(l => l.userid == d.userid);
        if (p.length) {
          p[0].imlist.push(d);
        } else {
          //如果没有
          d.imlist = [d];
          data.arr.personArr.push(d);
        }
        console.log(data.arr.personArr);
        console.log(data);
        //收到服务器消息，使用evt.data提取
      };
      this.websocket.onerror = function(evt) {
        //产生异常
        alert("WebSocket异常！");
      };
    },
    //显示右边聊天窗口
    showRecord(item) {
      console.log(item);
      this.other.useritem = item;

      //   this.other.activeIndex = userid;
      //   this.other.userid = userid;
      //   this.other.serviceuserid = this.obj.serviceuser.userid;
    }
  }
};
</script>
<style  lang="scss">
.service {
  @include public-father-css;
  main {
    // border: 1px solid red;
    height: 100%;
    display: flex;
    article {
      border: 1px solid #eee;
      width: 250px;
      height: 100%;
      overflow-y: auto;
      .title {
        height: 80px;

        display: flex;
        align-items: center;
        text-align: left;
        border-bottom: 1px solid #eee;
        padding-left: 10px;
        img {
          width: 50px;
          height: 50px;
          margin-right: 3px;
        }
      }
      .item {
        height: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        border-bottom: 1px solid #eee;
        p {
          display: flex;
          align-items: center;
          span {
            font-size: 13px;
          }
        }
        img {
          width: 50px;
          height: 50px;
          margin-right: 3px;
        }
        font {
          font-size: 14px;
          font-weight: 500;
          color: red;
        }
      }
      .active {
        background: #eee;
      }
    }
  }
}
</style>