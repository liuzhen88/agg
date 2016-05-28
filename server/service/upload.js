var config = require("../config/config");
var q = require("q");
var fs = require("fs");
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

function uploadSourceForImage(imgData, fileType, fileName){
	var deferred = q.defer();
	var imgData = JSON.parse(imgData);
	var fileType = JSON.parse(fileType);
	var fileName = JSON.parse(fileName);
	var path = config.path;
	for(var i=0;i<imgData.length;i++){
		(function(i){

			var base64Data = imgData[i].replace(/^data:image\/\w+;base64,/, "");
			//开启Node缓冲区
			var dataBuffer = new Buffer(base64Data, 'base64');	
			var name = fileName[i];
			var newFilePath = config.path+ new Date().getTime()+"."+fileType[i];
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
			    	var context = config.data.success;
			    	//写入图片成功之后应该保存链接到Mongodb之中
			    	deferred.resolve(context);
			    });
			    
			});
		})(i);
	}
	return deferred.promise;
}

module.exports = {
	getToken:getToken,
	uploadSourceForImage:uploadSourceForImage
}