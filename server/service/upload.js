var config = require("../config/config");
var q = require("q");
var fs = require("fs");
var bannerModel = require("../schema/staicUploadImg");
var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = "";
qiniu.conf.SECRET_KEY = "";

var bannerArray = [];
var bucket = "";
var key = "test.png";

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}



function getToken(req, res){
	var deferred = q.defer();
	//生成上传 Token
	var token = uptoken(bucket, key);
	var content = {};
	content.uptoken = token;
	deferred.resolve(content);

	return deferred.promise;
}

function uploadSource(imgData, fileType, fileName, req, callback){
	var deferred = q.defer();
	var imgData = JSON.parse(imgData);
	var fileType = JSON.parse(fileType);
	var fileName = JSON.parse(fileName);
	
	var path = config.path;
	bannerArray = [];
	imgData.forEach(function(value,i){
		var base64Data = value.replace(/^data:image\/\w+;base64,/, "");
		//开启Node缓冲区
		var dataBuffer = new Buffer(base64Data, 'base64');	
		var name = fileName[i];
		var lastFileName = new Date().getTime()+"."+fileType[i];
		var newFilePath = config.path+ lastFileName;
		//写入图片成功之后应该保存链接到Mongodb之中
    	var bannerObj = {
    		bannerUrl:config.uploadUrl+"/"+lastFileName,
    		name:name,
    		operator:req.session.user.username
    	}
    	bannerArray.push(bannerObj);
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
		    	 	
		    	deferred.resolve(bannerArray);
		    });
		    
		});
	});
	return deferred.promise;
}

function uploadSourceForImage(imgData, fileType, fileName, req){
	var deferred = q.defer();
	uploadSource(imgData, fileType, fileName, req).then(function(bannerArray){
		bannerModel.findOne({
			"type":"banner"
		},function(err,docs){
			if(err){
				console.log("search banner data is error:"+err);
				deferred.reject(err);
			}
			if(docs.banner.length>0){
				bannerArray = docs.banner.concat(bannerArray);	
			}
			bannerModel.update({
				"type":"banner"
			},{
				$set:{
					banner:bannerArray
				}
			},function(err){
				if(err){
					console.log("update is error :" +err);
					deferred.reject(err);
				}
				console.log("update success");
				var context = config.data.success;
				deferred.resolve(context);
			})
		});
	}).fail(function(err){
		deferred.reject(err);
	});
	return deferred.promise;
}

module.exports = {
	getToken:getToken,
	uploadSourceForImage:uploadSourceForImage
}