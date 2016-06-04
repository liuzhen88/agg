var q = require("q");
var fs = require("fs");
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

module.exports = {
	saveNewAnnounce:saveNewAnnounce
}