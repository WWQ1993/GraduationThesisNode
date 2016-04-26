seajs.config({
	// 基础路径
	base: './js/',
	// 路径配置
	//paths: {
	//  'js': '../js',
	//  'css': '../css',
	//  'dist' : './dist'
	//},
	// 别名配置
	alias: {
	  'index' :'js/index'
	},
	//预先加载
	preLoad: [
		"./js/jquery.js"
	],
	charset: 'utf-8'
})