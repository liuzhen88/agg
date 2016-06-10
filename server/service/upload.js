var config = require("../config/config");
var q = require("q");
var fs = require("fs");
var _ = require("underscore");
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

function uploadSource(imgData, fileType, fileName, Href, req, callback){
	var deferred = q.defer();
	var imgData = JSON.parse(imgData);
	var fileType = JSON.parse(fileType);
	var fileName = JSON.parse(fileName);
	var Href = JSON.parse(Href);

	var path = config.path;
	bannerArray = [];
	imgData.forEach(function(value,i){
		var base64Data = value.replace(/^data:image\/\w+;base64,/, "");
		//开启Node缓冲区
		var dataBuffer = new Buffer(base64Data, 'base64');	
		var name = fileName[i];
		var lastFileName = new Date().getTime()+"."+fileType[i];
		var newFilePath = config.path+ lastFileName;
		var href = Href[i];
		//写入图片成功之后应该保存链接到Mongodb之中
    	var bannerObj = {
    		bannerUrl:config.uploadUrl+"/"+lastFileName,
    		name:name,
    		href:href,
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

function uploadSourceForImage(imgData, fileType, fileName, Href, req){
	var deferred = q.defer();
	uploadSource(imgData, fileType, fileName, Href, req).then(function(bannerArray){
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

function updateBannerHref(req, res){
	var deferred = q.defer();
	var newHref = req.body.newHref;
	var dataId = req.body.dataId;
	getBannerDataService().then(function(result){
		result.banner.forEach(function(value,index){
			if(value._id == dataId){
				updateHrefByDataId(index,newHref,result).then(function(data){
					deferred.resolve(data);
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

function getBannerDataService(){
	var deferred = q.defer();
	bannerModel.findOne({
		"type":"banner"
	},function(err,result){
		if(err){
			console.log("search is error :" +err);
			deferred.reject(err);
		}
		deferred.resolve(result);
	});

	return deferred.promise;
}

function updateHrefByDataId(index, newHref, result){
	var deferred = q.defer();
	var bannerDataArray = result.banner;
	bannerDataArray[index].href = newHref;
	bannerModel.update({
		"type":"banner"
	},{
		$set:{
			banner:bannerDataArray
		}
	},function(err){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var context = config.data.success;
		deferred.resolve(context);
	});

	return deferred.promise;
}

function deleteBannerFileByUrl(req, res){
	var deferred = q.defer();
	var dataId = req.body.dataId;
	var path = req.body.path;
	
	getBannerDataService().then(function(result){
		var bannerDataArray = result.banner;
		bannerDataArray.forEach(function(value,index){
			if(value._id == dataId){
				deleteBannerDataByIndex(bannerDataArray,index).then(function(data){
					console.log("====================");
					console.log(path);
					console.log("====================");
					fs.unlink(path,function(){
						deferred.resolve(data);
					});	
				}).fail(function(err){	
					deferred.reject(err);
				});
			}
		});
	}).fail(function(err){
		console.log(err);
		deferred.reject(err);
	});


	return deferred.promise;
}

function deleteBannerDataByIndex(bannerDataArray, index){
	var deferred = q.defer();
	bannerDataArray[index] = '';
	bannerDataArray = _.compact(bannerDataArray);

	bannerModel.update({
		"type":"banner"
	},{
		$set:{
			banner:bannerDataArray
		}
	},function(err){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		var context = config.data.success;
		deferred.resolve(context);
	});

	return deferred.promise;
}

module.exports = {
	getToken:getToken,
	uploadSourceForImage:uploadSourceForImage,
	updateBannerHref:updateBannerHref,
	deleteBannerFileByUrl:deleteBannerFileByUrl
}