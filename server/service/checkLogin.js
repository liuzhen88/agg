var q = require("q");
var config = require("../config/config");
var userSchemaModel = require("../schema/userSchema");

function checkUserLogin(username, password, req, res){
	var deferred = q.defer();
	userSchemaModel.findOne({
		username:username
	},function(err,result){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		if(!result){
			console.log("查询无此数据");
			var data = {
				message:"登陆失败，无此用户"
			}
			deferred.reject(data);
		}else{
			if(password === result.password){
				var data = {
					code:"200",
					message:"登陆成功",
					session:{
						id:result._id
					}
				}
				req.session.user = result;
				deferred.resolve(data);	
			}else{
				var data = {
					message:"登陆失败,密码错误"
				}
				deferred.reject(data);
			}
		}
	})

	return deferred.promise; 
}

function exitLogin(req, res){
	var deferred = q.defer();
	//console.log(req.session.user);
	delete req.session.user;
	var context = config.data.success;
	deferred.resolve(context);
	return deferred.promise;
}

function modify(req, res){
	var deferred = q.defer();
	var oldPassWord = req.body.oldPassWord;
	if(req.session.user.password!=oldPassWord){
		var context = config.data.notPass;
		deferred.resolve(context);
	}
	var username = req.session.user.username;
	var newPassWord = req.body.newPassWord;
	userSchemaModel.update({
		"username":username
	},{
		$set:{
			"password":newPassWord
		}
	},function(err){
		if(err){
			console.log("modify is error :" +err);
			deferred.reject(err);
		}
		var content = config.data.success;
		delete req.session.user;
		deferred.resolve(content);
	});

	return deferred.promise;
}

module.exports = {
	checkUserLogin:checkUserLogin,
	exitLogin:exitLogin,
	modify:modify
}