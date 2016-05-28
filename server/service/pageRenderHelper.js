var helper = {};

helper.checkSession = function(req , res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	var data = {
		logoUrl:"/images/logo.png",
		this_position:"首页广告图",
		list:[
			"首页广告图",
			"商品展示",
			"公告展示",
			"分类管理",
			"专题管理"
		]
	}
	next(data);
}

module.exports = helper;
