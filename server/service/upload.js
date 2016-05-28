var config = require("../config/config");
var q = require("q");
var fs = require("fs");
var bannerModel = require("../schema/staicUploadImg");
var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = "";
qiniu.conf.SECRET_KEY = "";

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

function uploadSourceForImage(imgData, fileType, fileName, req){
	var deferred = q.defer();
	var imgData = JSON.parse(imgData);
	var fileType = JSON.parse(fileType);
	var fileName = JSON.parse(fileName);
	var bannerArray = [];
	var path = config.path;
	for(var i=0;i<imgData.length;i++){
		(function(i){

			var base64Data = imgData[i].replace(/^data:image\/\w+;base64,/, "");
			//开启Node缓冲区
			var dataBuffer = new Buffer(base64Data, 'base64');	
			var name = fileName[i];
			var lastFileName = new Date().getTime()+"."+fileType[i];
			var newFilePath = config.path+ lastFileName;
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
			    	//写入图片成功之后应该保存链接到Mongodb之中
			    	var bannerObj = {
			    		bannerUrl:config.uploadUrl+lastFileName,
			    		name:name,
			    		operator:req.session.user.username
			    	}
			    	bannerArray.push(bannerObj);			    	
			    });
			    
			});
		})(i);
	}
	var bannerData = new bannerModel({
		"banner":bannerArray
	});
	bannerData.save(function(err){
		if(err){
			console.log("save is error :" +err);
			deferred.reject(err);
		}
		console.log("save is ok");
		var context = config.data.success;
		deferred.resolve(context);
	});
	return deferred.promise;
}

module.exports = {
	getToken:getToken,
	uploadSourceForImage:uploadSourceForImage
}