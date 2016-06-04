var bannerModel = require("../schema/staicUploadImg");
var classModel = require("../schema/class");
var helper = {};

helper.checkSession = function(req , res, next){
	console.log(req.session);
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	getBannerData(function(bannerData){
		var data = {
			logoUrl:"/images/logo.png",
			this_position:"",
			list:[
				"首页广告图",
				"商品展示",
				"公告管理",
				"分类管理",
				"专题管理"
			],
			bannerImageData:bannerData
		}
		next(data);
	});
	
}

helper.checkSessionForShowGoods = function(req , res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	var data = {
		logoUrl:"/images/logo.png",
		this_position:"",
		list:[
			"首页广告图",
			"商品展示",
			"公告管理",
			"分类管理",
			"专题管理"
		]
	};
	next(data);
}

helper.checkSessionForClassManage = function(req, res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	getClassData(function(docs){
		var data = {
			logoUrl:"/images/logo.png",
			this_position:"",
			list:[
				"首页广告图",
				"商品展示",
				"公告管理",
				"分类管理",
				"专题管理"
			],
			classLists:docs
		};
		next(data);
	});
}

helper.checkSessionForClasses = function(req, res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	var data = {
		logoUrl:"/images/logo.png",
		this_position:"",
		list:[
			"首页广告图",
			"商品展示",
			"公告管理",
			"分类管理",
			"专题管理"
		]
	};
	next(data);
}

helper.checkSessionForAnnounce = function(req, res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	var data = {
		logoUrl:"/images/logo.png",
		this_position:"",
		list:[
			"首页广告图",
			"商品展示",
			"公告管理",
			"分类管理",
			"专题管理"
		]
	};
	next(data);
}

function getBannerData(cb){
	bannerModel.findOne({
		"type":"banner"
	},function(err,docs){
		if(err){
			console.log("search banner data is error:"+error);
			return;
		}
		cb(docs);
	});
}

function getClassData(cb){
	classModel.find(function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		cb(docs);
	})
}

module.exports = helper;
