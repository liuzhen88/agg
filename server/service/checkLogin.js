var q = require("q");
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

module.exports = {
	checkUserLogin:checkUserLogin
}