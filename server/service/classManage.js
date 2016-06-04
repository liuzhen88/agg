var q = require("q");
var config = require("../config/config");
var classModel = require("../schema/class");

function addNewClassByName(req, res){
	var deferred = q.defer();
	var className = req.body.className;
	var index = 1;
	var flag = true;
	getClassData().then(function(data){
		if(data.length != 0){
			index = data.length + 1;
		}
		data.forEach(function(value,i){
			if(value.className == className){
				var content = config.data.hasExit;
				flag = false;
				deferred.resolve(content);
			}
		});
		if(flag){
			var classModelData = new classModel({
				serial_number:index,
				className:className,
				class_id:new Date().getTime()
			});
			classModelData.save(function(err){
				if(err){
					console.log(err);
					deferred.reject(err);
				}
				var context = config.data.success;
				deferred.resolve(context);
			})
		}
	}).fail(function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

function getClassData(){
	var deferred = q.defer();
	classModel.find(function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		deferred.resolve(docs);
	});

	return deferred.promise;
}

function editClassById(req, res){
	var deferred = q.defer();
	var className = req.body.className;
	var class_id = req.body.class_id;
	classModel.findOne({
		class_id:class_id
	},function(err,docs){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		if(docs){
			classModel.update({
				class_id:class_id
			},{
				$set:{
					className:className
				}
			},function(err){
				if(err){
					console.log("update is error :" +err);
					deferred.reject(err);
				}
				var context = config.data.success;
				deferred.resolve(context);
			});
		}else{
			var context = config.data.notClassId;
			deferred.resolve(context);
		}
	});

	return deferred.promise;
}

function deleteClassByClassId(req, res){
	var deferred = q.defer();
	var class_id = req.body.class_id;

	classModel.remove({
		class_id:class_id
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
	addNewClassByName:addNewClassByName,
	editClassById:editClassById,
	deleteClassByClassId:deleteClassByClassId
}