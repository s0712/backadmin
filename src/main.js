// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/reset.css';
import location from './location';
import './request';
import axios from 'axios';
import VueAxios from 'vue-axios';
import moment from 'moment';
import echarts from 'echarts';
import store from './vux/store';
Vue.prototype.$echarts = echarts;

Vue.use(VueAxios, axios);

Vue.use(ElementUI);
Vue.prototype.$location = location;
Vue.prototype.$axios = axios;
Vue.prototype.moment = moment;

// 阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
});
