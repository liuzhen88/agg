var bannerModel = require("../schema/staicUploadImg");
var classModel = require("../schema/class");
var noticeModel = require("../schema/announceSchema");
var specialModel = require("../schema/specialManageSchema");
var shopGoodsModel = require("../schema/shopGoods");
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
	getShopGoods(function(docs){
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
			shopGoods:docs
		};
		next(data);
	});	
}

helper.checkSessionForAddGoods = function(req, res, next){
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
			classData:docs
		};
		next(data);
	});	
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
	getNoticeData(function(docs){
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
			noticeList:docs
		};
		next(data);
	});
	
}

helper.checkSessionForEditNotice = function(req, res, notice_id, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	getNoticeDataById(notice_id,function(docs){
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
			thatNoticeData:docs
		};
		next(data);
	});
}

helper.checkSessionForSpecialManage = function(req, res , next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	getSpecialModel(function(docs){
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
			specialData:docs
		};
		next(data);
	});
	
}

helper.checkSessionForSpecialEdit = function(req, res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	var id = req.query.id;
	specialModel.findOne({
		"_id":id
	},function(err,docs){
		if(err){
			console.log(err);
			return
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
			],
			specialList:docs
		};
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

function getClassData(cb){
	classModel.find(function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		cb(docs);
	});
}

function getNoticeData(cb){
	noticeModel.find(function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		cb(docs);
	});
}

function getNoticeDataById(notice_id, cb){
	noticeModel.findOne({
		"_id":notice_id
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		cb(docs);
	});
}

//get special data
function getSpecialModel(cb){
	specialModel.find(function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		cb(docs);
	});
}

//get shop goods data
function getShopGoods(cb){
	shopGoodsModel.find(function(err,docs){
		if(err){
			console.log(err);
			return
		}
		cb(docs);
	});
}

module.exports = helper;
