'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	API_HOST: '"http://yun.carotg.com/index.php/Home"' // 开发环境接口地址(这里是增加的内容)

	// API_HOST: '"http://116.62.158.226:8080/hbadmin"'
	// API_HOST: '"http://132.232.31.171:8080/hbadmin/public"'
});
