var q = require("q");
var fs = require("fs");
var _ = require("underscore");
var config = require("../config/config");
var noticeSchemaModel = require("../schema/announceSchema")

function saveNewAnnounceImage(req, res){
	var deferred = q.defer();
	var announceName = req.body.announceName;
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
		var newFilePath = config.annountPath+ lastFileName;
		//写入图片成功之后应该保存链接到Mongodb之中
    	var noticeObj = {
    		noticeImageUrl:config.annountUploadUrl+"/"+lastFileName,
    		name:name,
    		operator:req.session.user.username
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
		    		data:noticeArray,
		    		announceName:announceName
		    	}
		    	deferred.resolve(context);
		    });
		    
		});
	});

	return deferred.promise;
}

function saveNewAnnounce(req, res){
	var deferred = q.defer();
	saveNewAnnounceImage(req, res).then(function(contextData){
		searchNoticeDB().then(function(docs){
			var index = 1;
			if(docs.length>0){
				index = docs.length+1;
			}
			var noticeModelData = new noticeSchemaModel({
				serial_number:index,
				noticeName:contextData.announceName,
				noticeImage:contextData.data,
				notice_id:new Date().getTime()
			});
			noticeModelData.save(function(err){
				if(err){
					console.log("save is error:"+err);
					deferred.reject(err);
				}
				var conext = config.data.success;
				deferred.resolve(conext);
			});
		}).fail(function(err){
			deferred.reject(err);
		});
	}).fail(function(err){
		res.send(err);
	});

	return deferred.promise;
}

function searchNoticeDB(){
	var deferred = q.defer();
	noticeSchemaModel.find(function(err,docs){
		if(err){
			console.log("get notice db data is error:"+err);
			deferred.reject(err);
		}
		deferred.resolve(docs);
	});

	return deferred.promise;
}

function delSingleImage(req, res){
	var deferred = q.defer();
	var noticeObjectId = req.body.noticeObjectId;
	var noticeImageListId = req.body.noticeImageListId;
	getAnnounceSingleDataById(noticeObjectId,noticeImageListId).then(function(data){
		if(!data){
			var content = config.data.notFindDeleteObj;
			deferred.resolve(content);
		}
		var noticeImageArray = data.noticeImage;
		noticeImageArray.forEach(function(value,index){
			if(value._id == noticeImageListId){
				var imageUrl = value.noticeImageUrl;
				//先删除源文件  删除buffer缓冲
				deleteImageSelf(imageUrl).then(function(data){
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
	noticeSchemaModel.findOne({
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

function deleteImageSelf(imageUrl){
	var deferred = q.defer();
	var path = imageUrl; 	 
	fs.unlink(path,function(err){
		if(err){
			console.log("delete is error :" +JSON.stringify(err));
			deferred.reject(err);
		}
		console.log("delete images file success");
		deferred.resolve("delete success");
	});

	return deferred.promise;
}

function updateNoticeSingleData(noticeObjectId, noticeImageArray){
	var deferred = q.defer();
	noticeSchemaModel.uptate({
		"_id":noticeObjectId
	},{
		$set:{
			noticeImage:noticeImageArray
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

module.exports = {
	saveNewAnnounce:saveNewAnnounce,
	delSingleImage:delSingleImage
}