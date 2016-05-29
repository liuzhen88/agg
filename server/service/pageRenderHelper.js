var bannerModel = require("../schema/staicUploadImg");
var helper = {};

helper.checkSession = function(req , res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	getBannerData(function(bannerData){
		var data = {
			logoUrl:"/images/logo.png",
			this_position:"首页广告图",
			list:[
				"首页广告图",
				"商品展示",
				"公告展示",
				"分类管理",
				"专题管理"
			],
			bannerImageData:bannerData
		}
		next(data);
	});
	
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

module.exports = helper;
