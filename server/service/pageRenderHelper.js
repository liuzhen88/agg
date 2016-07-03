var bannerModel = require("../schema/staicUploadImg");
var classModel = require("../schema/class");
var noticeModel = require("../schema/announceSchema");
var specialModel = require("../schema/specialManageSchema");
var shopGoodsModel = require("../schema/shopGoods");
var weixin = require("../service/weixin");
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

helper.checkSessionForEidtGoods = function(req, res, next){
	if(!req.session.user){
		res.redirect("/login");
		return;
	}
	var id = req.query.id;
	shopGoodsModel.findOne({
		"_id":id
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		getClassData(function(classList){
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
				singleShopGoods:docs,
				classData:classList
			};
			next(data);
		});
		
	});
}

helper.checkSessionForSpecialShop = function(req, res, next){
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
			],
			specialData:docs
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
	// noticeModel.find(function(err,docs){
	// 	if(err){
	// 		console.log(err);
	// 		return;
	// 	}
	// 	cb(docs);
	// });
	//倒序
	noticeModel.find().sort({
		"serial_number":-1
	}).exec(function(err,docs){
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


//pc

helper.pcIndex = function(req, res, next){
	bannerModel.findOne({
		"type":"banner"
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		classModel.find(function(err,classData){
			if(err){
				console.log(err);
				return;
			}
			weixin.getSpecialClassData(req,res).then(function(data){
				/*分页service*/
				noticeModel.find().sort({"serial_number":-1}).limit(3).exec(function(err,notice){
					if(notice.length>0){
						notice.forEach(function(value,index){
							var time = value.notice_id;
							time = get_time(time);
							notice[index].notice_id = time;
						});
					} 
					var context = {
						banner:docs,
						classData:classData,
						special:data,
						notice:notice
					};
					next(context);
				});
			}).fail(function(err){
				console.log(err);
			});
			
		});
		
	})
}
function get_time(this_time){
	Date.prototype.format = function(format) {
		var date = {
			   "M+": this.getMonth() + 1,
			   "d+": this.getDate(),
			   "h+": this.getHours(),
			   "m+": this.getMinutes(),
			   "s+": this.getSeconds(),
			   "q+": Math.floor((this.getMonth() + 3) / 3),
			   "S+": this.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			   format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			   if (new RegExp("(" + k + ")").test(format)) {
					  format = format.replace(RegExp.$1, RegExp.$1.length == 1
							 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			   }
		}
		return format;
	}
	var cc=new Date(parseInt(this_time));
	var aa=cc.format('yyyy-MM-dd h:m:s');
	return aa;
}


helper.pcNotice = function(req, res, next){
	var id = req.query.id;
	noticeModel.findOne({
		"_id":id
	},function(err,docs){
		next(docs);
	});
}

//pc 专题商品第一个
helper.pcSpecialShop = function(req, res, next){
	var id = req.query.dataId;
	weixin.getSpecialDetailById(req,res).then(function(data){
		console.log(data);
		next(data);
	}).fail(function(err){
		console.log(err);
	})
}

//pc 分类详情
helper.pcClassDetail = function(req, res, next){
	var className = req.query.className;
	shopGoodsModel.find({
		"class_name":className
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		if(!docs){
			var data = [];
			next(data);
		}else{
			next(docs); 
		}
	});
}

helper.pcClassShopDetail = function(req, res, next){
	var id = req.query.id;
	shopGoodsModel.findOne({
		"_id":id
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		next(docs);
	});
}

helper.pcSpecialShopDetail = function(req, res, next){
	var special_name = req.query.special_name;
	var special_class = req.query.special_class;
	var module_id = req.query.module_id;
	specialModel.findOne({
		"special_name":special_name,
		"special_class":special_class
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		var context = {};
		docs.shop_module.forEach(function(value,index){
			if(value._id == module_id){
				context.goods_name = value.goods_name;
				context.goods_content = value.goods_content;
			}
		})
		next(context);
	});
}

helper.pcSpecialActive = function(req, res, next){
	weixin.getSpecialClassData(req,res).then(function(data){
		console.log(data);
		next(data);
	}).fail(function(err){
		console.log(err);
	});
}
module.exports = helper;
