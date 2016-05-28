var q = require("q");
var userSchemaModel = require("../schema/userSchema");

function add(username, password){
	var deferred = q.defer();
	var userData = new userSchemaModel({
		"username":username,
		"password":password
	});

	userData.save(function(err){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		console.log("save is ok");
		var result={
			"code":"200",
			"message":"ok"
		};
		deferred.resolve(result);
	});

	return deferred.promise;
}

module.exports = {
	add:add
}