var q = require("q");
var fs = require("fs");
var config = require("../config/config");
var _ = require("underscore");
var specialSchema = require("../schema/specialManageSchema");

function uploadSpecialData(req, res){
	var deferred = q.defer();
	var specialName = req.body.specialName;	//专题名称
	var announce = JSON.parse(req.body.announce); //图片base64
	var fileType = JSON.parse(req.body.fileType); //图片格式
	var fileName = JSON.parse(req.body.fileName); //图片名字
	var classArray = JSON.parse(req.body.classArray); //分类名称
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
		    		console.log("=====================");
			    	//二进制流保存之后,同步数据持久化
			    	saveSpecialData(specialName,classArray,special_image).then(function(data){
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

function saveSpecialData(specialName, classArray, special_image){
	var deferred = q.defer();
	var classNewArray = [];
	classArray.forEach(function(v,i){
		var d = {
			special_class_name:v
		};
		classNewArray.push(d);
	});
	findSpecialData().then(function(data){
		var len = data.length;
		var schemaModel = new specialSchema({
			serial_number:Number(len+1),
			special_name:specialName,
			special_class:classNewArray,
			special_image:special_image
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
						special_image:newArray
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

module.exports = {
	uploadSpecialData:uploadSpecialData,
	deleteSpecialListById:deleteSpecialListById,
	delSpecialListDataById:delSpecialListDataById,
	uploadNewFileForSpecialById:uploadNewFileForSpecialById

}