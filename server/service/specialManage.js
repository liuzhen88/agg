var q = require("q");
var fs = require("fs");
var config = require("../config/config");
var _ = require("underscore");
var specialSchema = require("../schema/specialManageSchema");
var shopGoodsSchema = require("../schema/shopGoods");


//判断分类是否存在
function middleWare(req, res, cb){
	var specialName = req.body.specialName;	//专题名称
	var className = JSON.parse(req.body.className); //分类名称

	specialSchema.find({
		"special_name":specialName,
		"special_class":className
	},function(err,docs){
		if(err){
			console.log(err);
			return;
		}
		if(docs.length>0){
			var context = config.data.notCreat;
			res.send(context);
		}else{
			cb();
		}
	});
}


function uploadSpecialData(req, res){
	var deferred = q.defer();
	middleWare(req, res, function(){


		var specialName = req.body.specialName;	//专题名称
		var announce = JSON.parse(req.body.announce); //图片base64
		var fileType = JSON.parse(req.body.fileType); //图片格式
		var fileName = JSON.parse(req.body.fileName); //图片名字
		var className = JSON.parse(req.body.className); //分类名称
		var qz = req.body.qz;	//权重
		var special_image = [];

		announce.forEach(function(value,i){
			var base64Data = value.replace(/^data:image\/\w+;base64,/, "");
			//起开Node.js buffer缓冲
			var dataBuffer = new Buffer(base64Data, 'base64');
			var name = fileName[i];
			var lastFileName = new Date().getTime()+"_"+i+"."+fileType[i];
			var newFilePath = config.specialPath + lastFileName;

			var noticeObj = {
	    		special_image_url:config.specialDataPath+lastFileName,
	    		name:name,
	    		operator:req.session.user.username,
	    		lastFileName:lastFileName
	    	};
	    	special_image.push(noticeObj);
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
			    	
			    	if(i == announce.length-1){
			    		 
				    	//二进制流保存之后,同步数据持久化
				    	saveSpecialData(specialName,className,special_image,qz).then(function(data){
				    		var context = config.data.success;
				    		deferred.resolve(context);
				    	}).fail(function(err){	
				    		deferred.reject(err);
				    	});	
			    	}
			    });
			    
			});
		});
	});
	return deferred.promise;
}

function saveSpecialData(specialName, className, special_image, qz){
	var deferred = q.defer();
	// var classNewArray = [];
	// classArray.forEach(function(v,i){
	// 	var d = {
	// 		special_class_name:v
	// 	};
	// 	classNewArray.push(d);
	// });
	if(qz == "" || qz=="undefined"){
		qz = 0;
	}
	findSpecialData().then(function(data){
		var len = 1;
		if(data.length>0){
			var arr = [];
			data.map(function(d){
				arr.push(d.serial_number);
			});
			len = Number(_.max(arr))+Number(1);
		}
		var schemaModel = new specialSchema({
			serial_number:len,
			qz:Number(qz),
			special_name:specialName,
			special_class:className,
			special_image:special_image,
			shop_module:[]
		});
		schemaModel.save(function(err){
			if(err){
				console.log("save is error");
				deferred.reject(err);
			}
			var context = config.data.success;
			deferred.resolve(context);
		});
	}).fail(function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

function findSpecialData(){
	var deferred = q.defer();
	specialSchema.find(function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		deferred.resolve(docs);
	});

	return deferred.promise;
}


//delete special list

function deleteSpecialListById(id){
	var deferred = q.defer();
	deleteImage(id).then(function(data){
		specialSchema.remove({
			"_id":id
		},function(err){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			var context = config.data.success;
			deferred.resolve(context);
		});
	}).fail(function(err){
		deferred.reject(err);
	});
	

	return deferred.promise;
}

//delete images
function deleteImage(id){
	var deferred = q.defer();
	var delPath = config.delPath;
	specialSchema.findOne({
		"_id":id
	},function(err,data){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		data.special_image.forEach(function(value,index){
			var path = delPath+value.lastFileName;
			fs.unlink(path,function(err){
				if(err){
					console.log(JSON.stringify(err));
					deferred.reject(err);
				}
				deferred.resolve("success");
			});
		});
	});

	return deferred.promise;
}

function delSpecialListDataById(req, res){
	var deferred = q.defer();
	var noticeObjectId = req.body.noticeObjectId;
	var noticeImageListId = req.body.noticeImageListId;
	getAnnounceSingleDataById(noticeObjectId,noticeImageListId).then(function(data){
		if(!data){
			var content = config.data.notFindDeleteObj;
			deferred.resolve(content);
		}
		var noticeImageArray = data.special_image;
		noticeImageArray.forEach(function(value,index){
			if(value._id == noticeImageListId){
				var imageUrl = value.special_image_url;
				var lastFileName = value.lastFileName;
				//先删除源文件  删除buffer缓冲
				deleteImageSelf(imageUrl,lastFileName).then(function(data){	 
					noticeImageArray[index] = '';
					noticeImageArray = _.compact(noticeImageArray);
					//更新相应的db data
					updateNoticeSingleData(noticeObjectId,noticeImageArray).then(function(data){ 
						deferred.resolve(data); 
					}).fail(function(err){
						deferred.reject(err);
					});
					 
				}).fail(function(err){
					deferred.reject(err);
				});
			}
		});
	}).fail(function(err){
		deferred.reject(err);
	});
	return deferred.promise;
}

function getAnnounceSingleDataById(noticeObjectId, noticeImageListId){
	var deferred = q.defer();
	specialSchema.findOne({
		"_id":noticeObjectId
	},function(err,docs){
		if(err){
			console.log("getAnnounceSingleData is error:" +err);
			deferred.reject(err);
		}
		deferred.resolve(docs);
	});

	return deferred.promise;
}

function deleteImageSelf(imageUrl, lastFileName){
	var deferred = q.defer();
	var path = "./public/images/special/"+lastFileName; 	 
	fs.unlink(path,function(err){
		if(err){
			console.log("delete is error :" +JSON.stringify(err));
			deferred.reject(err);
			return;
		}
		console.log("delete images file success");
		deferred.resolve("delete success");
	});

	return deferred.promise;
}

function updateNoticeSingleData(noticeObjectId, noticeImageArray){
	var deferred = q.defer();
	specialSchema.update({
		"_id":noticeObjectId
	},{
		$set:{
			special_image:noticeImageArray
		}
	},function(err){
		if(err){
			console.log("update notice single data is error :" +err);
			deferred.reject(err);
		}
		var context = config.data.success;
		deferred.resolve(context);
	});

	return deferred.promise;
}


function uploadNewFileForSpecialById(req, res){
	var deferred = q.defer();
	var id = req.body.id;
	var qz = req.body.qz;
	var classListName = req.body.classListName;
	var announce = JSON.parse(req.body.announce);
	if(announce.length>0){
		saveNewAnnounceImage(req, res).then(function(data){
			specialSchema.findOne({
				"_id":id
			},function(err,docs){
				if(err){
					console.log(err);
					deferred.reject(err);
				}
				if(!docs){
					console.log("no match data");
					var context = config.data.notFound;
					deferred.resolve(context);
				}else{
					var noticeImage = docs.special_image;
					var newArray = noticeImage.concat(data.data);
					console.log("data.data is " + data.data);
					console.log("=================");
					console.log(newArray);
					console.log("======================");
					specialSchema.update({
						"_id":id
					},{
						$set:{
							special_image:newArray,
							qz:qz,
							special_name:classListName
						}
					},function(err){
						if(err){
							console.log(err);
							deferred.reject(err);
						}
						var content = config.data.success;
						deferred.resolve(content);
					});
				}

			});
		}).fail(function(err){
			res.send(err);
		});
	}else{
		specialSchema.update({
			"_id":id
		},{
			$set:{
				special_name:classListName,
				qz:qz
			}
		},function(err){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			var content = config.data.success;
			deferred.resolve(content);
		})
	}

	return deferred.promise;
}

function saveNewAnnounceImage(req, res){
	var deferred = q.defer();
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
		var newFilePath = config.specialPath + lastFileName;
		//写入图片成功之后应该保存链接到Mongodb之中
    	var noticeObj = {
    		special_image_url:config.specialDataPath+lastFileName,
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
		    	
	    		var context = {
		    		data:noticeArray
		    	};
		    	deferred.resolve(context);	
		    		
		    	
		    });
		    
		});
	});

	return deferred.promise;
}

//add new shop module
function addNewShopModuleById(req, res){
	var deferred =q.defer();
	var id = req.query.id;	//商品管理的id
	var mainId = req.query.mainId;	//自身专题id
	shopGoodsSchema.findOne({
		"_id":id
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var will_add_module = {
			serial_number:docs.serial_number,
			goods_name:docs.goods_name,
			class_name:docs.class_name,
			price:docs.price,
			goods_content:docs.goods_content
		}
		specialSchema.findOne({
			"_id":mainId
		},function(err,data){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			var old_module = data.shop_module;
			var new_add_module = old_module.concat(will_add_module);
			specialSchema.update({
				"_id":mainId
			},{
				$set:{
					shop_module:new_add_module
				}
			},function(err){
				if(err){
					console.log(err);
					deferred.reject(err);
				}
				var context = config.data.success;
				deferred.resolve(context);
			});
		})
	});

	return deferred.promise;
}

function delShopModuleById(req, res){
	var deferred = q.defer();
	var mainId = req.query.mainId;
	var id = req.query.id;
	specialSchema.findOne({
		"_id":mainId
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		if(!docs){
			var context = config.data.notFindDeleteObj;
			deferred.resolve(context);
			return;
		}
		var shop_modules = docs.shop_module;
		shop_modules.forEach(function(value,index){
			if(value._id == id){
				shop_modules[index] = "";
			}
		});
		shop_modules = _.compact(shop_modules);
		specialSchema.update({
			"_id":mainId
		},{
			$set:{
				shop_module:shop_modules
			}
		},function(err){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			var context = config.data.success;
			deferred.resolve(context);
		})
	});

	return deferred.promise;
}

module.exports = {
	uploadSpecialData:uploadSpecialData,
	deleteSpecialListById:deleteSpecialListById,
	delSpecialListDataById:delSpecialListDataById,
	uploadNewFileForSpecialById:uploadNewFileForSpecialById,
	addNewShopModuleById:addNewShopModuleById,
	delShopModuleById:delShopModuleById

}