var q = require("q");
var bannerSchema = require("../schema/staicUploadImg");
var noticeSchema = require("../schema/announceSchema");
var config = require("../config/config");

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
	noticeSchema.find(function(err,docs){
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

module.exports = {
	getBanner:getBanner,
	getNotice:getNotice,
	getNoticeDetailById:getNoticeDetailById
}