var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username:String,
	password:String
});

var userSchemaModel = mongoose.model("users",userSchema);

module.exports = userSchemaModel;