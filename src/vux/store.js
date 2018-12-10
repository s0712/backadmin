import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// mutation是同步的,只要comit muation, 它就会立即改变state , 这有利于我们追踪 状态的改变。如果 mution 之后，五分钟才改变state, 那就真不知道state 到底是哪个state了。
// action 是异步的，还有的错误处理也都在这里操作。

let store = new Vuex.Store({
	state: {
		userinfo: {}, //登录用户信息
		menulist: {} //用户登录菜单
	},
	mutations: {
		//设置用户信息
		setUserMsg(state, value) {
			state.userinfo = value;
		},
		//设置菜单
		setMenu(state, value) {
			state.menulist = value;
		},
		//确定登录成功
		toPrepare(state, value) {
			state.loginState = value;
		}
	},
	actions: {
		//设置用户信息
		setUserMsg({ commit }, value) {
			// value=JSON.parse(JSON.stringify(value));
			commit('setUserMsg', value);
		},
		//设置同步按钮状态
		setMenu({ commit }, value) {
			commit('setMenu', value);
		}
	}
});

export default store;
