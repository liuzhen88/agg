var q = require("q");
var _ = require("underscore");
var bannerSchema = require("../schema/staicUploadImg");
var noticeSchema = require("../schema/announceSchema");
var specialSchema = require("../schema/specialManageSchema");
var shopGoodsSchema = require("../schema/shopGoods");
var classSchema = require("../schema/class");
var config = require("../config/config");
var fs = require("fs");

function getBanner(req, res){
	var deferred = q.defer();
	bannerSchema.findOne({
		"type":"banner"
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var context = config.data.success;
		context.data = docs;
		deferred.resolve(context);
	});

	return deferred.promise;
}

function getNotice(req, res){
	var deferred = q.defer();
	noticeSchema.find().sort({"serial_number":-1}).exec(function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var context = config.data.success;
		context.data = docs;
		deferred.resolve(context);
	});

	return deferred.promise;
}

function getNoticeDetailById(req, res){
	var deferred = q.defer();
	var id = req.query.id;
	noticeSchema.findOne({
		"_id":id
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var context = config.data.success;
		context.data = docs;
		deferred.resolve(context);
	});

	return deferred.promise;
}

//获取分类
function getSpecialClassData(req, res){
	var deferred = q.defer();
	specialSchema.find(function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
			return;
		}
		if(docs.length == 0){
			
			var context = config.data.notFound;
			context.data = [];
			deferred.resolve(context);
		}else{

			//有数据的情况
			var sendData = [];
			var className = [];
			for(var i=0;i<docs.length;i++){
				 
				for(var j=1;j<docs.length;j++){
					if(i<j){
						if(docs[i].special_class == docs[j].special_class){
							 className.push(docs[i].special_class);

						} 
						
					} 
				}	 
			}
			className = _.uniq(className);
			className.forEach(function(value,index){
				var list = {};
				list.special_class = value;
				list.image = [];
				docs.forEach(function(v,i){
					if(value == v.special_class){
						var obj = v.special_image[0];
						list.image.push(obj);
					}
				});

				sendData.push(list);
			});
			var context = config.data.success;
			context.data = sendData;
			 
			deferred.resolve(context); 
		}
	});

	return deferred.promise;
}

//返回专题详情
function getSpecialDetailById(req, res){
	var deferred = q.defer();
	var data_id = req.query.dataId;
	specialSchema.find(function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		if(docs.length == 0){
			var context = config.data.success;
			context.data = {};
			deferred.resolve(context);
		}else{
			var id = "";
			docs.forEach(function(value,index){
				value.special_image.forEach(function(v,i){
					if(data_id == v._id){
						id = value._id;
					}
				});
			});
			if(id == ""){
				var context = config.data.success;
				context.data = {};
				deferred.resolve(context);
			}else{
				specialSchema.findOne({
					"_id":id
				},function(err,doc){
					if(err){
						console.log(err);
						deferred.reject(err);
					}
					var context = config.data.success;
					context.data = doc;
					deferred.resolve(context);
				});
			}
		}

	});

	return deferred.promise;
}

function getShopDetails(req, res){
	var deferred = q.defer();
	var goodsName = req.body.goodsName;
	var className = req.body.className;
	console.log(goodsName);
	console.log(className);
	shopGoodsSchema.findOne({
		"goods_name":goodsName,
		"class_name":className
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		console.log(docs);
		if(!docs){
			var context = config.data.success;
			context.data = {};
			deferred.resolve(context);
		}else{
			var context = config.data.success;
			context.data = docs;
			deferred.resolve(context);
		}
	});

	return deferred.promise;
}


function getClassData(){
	var deferred = q.defer();
	classSchema.find(function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		if(!docs){
			var context = config.data.success;
			context.data = [];
			deferred.resolve(context);
		}else{
			var context = config.data.success;
			context.data = docs;
			deferred.resolve(context);
		}
	});

	return deferred.promise;
}


function getClassListData(req, res){
	var deferred = q.defer();
	var className = req.body.text;

	shopGoodsSchema.find({
		"class_name":className
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}

		if(!docs){
			var context = config.data.success;
			context.data = [];
			deferred.resolve(context);
		}else{
			var context = config.data.success;
			context.data = docs;
			deferred.resolve(context);
		}
	});

	return deferred.promise;
}

//分页
function getNoticeByPage(req, res){
	var deferred = q.defer();
	var page = req.query.page;
	page = Number(page)-1;
	var skips = page * 3;
	noticeSchema.find().skip(skips).limit(3).exec(function(err,data){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var context = config.data.success;
		context.data = data;
		deferred.resolve(context);
	});

	return deferred.promise;
}

module.exports = {
	getBanner:getBanner,
	getNotice:getNotice,
	getNoticeDetailById:getNoticeDetailById,
	getSpecialClassData:getSpecialClassData,
	getSpecialDetailById:getSpecialDetailById,
	getShopDetails:getShopDetails,
	getClassData:getClassData,
	getClassListData:getClassListData,
	getNoticeByPage:getNoticeByPage
}