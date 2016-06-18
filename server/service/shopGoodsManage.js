var q = require("q");
var fs = require("fs");
var config = require("../config/config");
var shopGoodsModel = require("../schema/shopGoods");
var _ = require("underscore");

function addNewShopGoods(req, res){
	var deferred = q.defer();
	var goodsName = req.body.goodsName;
	var className = req.body.className;
	var announce = JSON.parse(req.body.announce);
	var fileType = JSON.parse(req.body.fileType);
	var fileName = JSON.parse(req.body.fileName);
	var noticeArray = [];

	announce.forEach(function(value,i){
		var base64Data = value.replace(/^data:image\/\w+;base64,/, "");
		//起开Node.js buffer缓冲
		var dataBuffer = new Buffer(base64Data, 'base64');
		var name = fileName[i];
		var lastFileName = new Date().getTime()+"_"+i+"."+fileType[i];
		var newFilePath = config.shopGoodsPath+ lastFileName;

    	var noticeObj = {
    		shopGoodsUrl:config.shopGoodsUploadUrl+"/"+lastFileName,
    		name:name,
    		operator:req.session.user.username,
    		lastFileName:lastFileName
    	}
    	noticeArray.push(noticeObj);
		fs.writeFile(name, dataBuffer, function(err) {
		    if(err){
		    	var content = config.data.error;
		    	content.message = err;
		      	deferred.reject(content);
		    }

		    fs.rename(name,newFilePath,function(err){
		    	if(err){
		    		console.log("file rename is error:"+err);
		    		var content = config.data.error;
			    	content.message = err;
			      	deferred.reject(content);
		    	} 

		    	//持久化
		    	if(i == announce.length-1){
		    		saveNewShopGoods(noticeArray,goodsName,className).then(function(data){
		    			var context = config.data.success;
		    			deferred.resolve(context);
		    		}).fail(function(err){
		    			deferred.reject(err);
		    		});
		    	}
		    	
		    });
		    
		});
	});

	return deferred.promise;
}

function saveNewShopGoods(noticeArray, goodsName, className){
	var deferred = q.defer();
	getGoodsData(function(docs){
		var arr = [];
		docs.map(function(d){
			arr.push(d.serial_number);
		});
		var index = Number(_.max(arr))+Number(1);
		// if(docs.length>1){
		// 	index = docs.length+1;
		// }
		var shopGoodsData = new shopGoodsModel({
			serial_number:index,
			goods_name:goodsName,
			class_name:className,
			goods_content:noticeArray
		});
		shopGoodsData.save(function(err){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			deferred.resolve("success");
		});
	});

	return deferred.promise;
}

function getGoodsData(cb){
	shopGoodsModel.find(function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		cb(docs);
	});
}

//delete
function deleteSingleGoodsById(req, res){
	var deferred = q.defer();
	var id = req.query.id;
	getSingleGoodsById(id,function(docs){
		//get images
		var basePath = config.delGoodsPath;
		docs.goods_content.forEach(function(value,index){
			var path = basePath + value.lastFileName;
			fs.unlink(path,function(err){
				if(err){
					console.log(err);
					deferred.reject(err);
					return;
				}
				deleteSrcData(id).then(function(data){
					deferred.resolve(data);
				}).fail(function(err){
					deferred.reject(err);
				});
			});
		});
	});

	return deferred.promise;
}

function getSingleGoodsById(id, callback){
	shopGoodsModel.findOne({
		"_id":id
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		callback(docs);
	});
}

function deleteSrcData(id){
	var deferred = q.defer();
	shopGoodsModel.remove({
		"_id":id
	},function(err){
		if(err){
			console.log(err);
			deferred.reject(err);
			return;
		}
		var context = config.data.success;
		deferred.resolve(context);
	});

	return deferred.promise;
}

module.exports = {
	addNewShopGoods:addNewShopGoods,
	deleteSingleGoodsById:deleteSingleGoodsById
}