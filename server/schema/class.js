var mongoose = require("mongoose");

var classSchema = new mongoose.Schema({
	serial_number:Number,	//序号
	className:String,	//分类名
	class_id:String,	//	分类id 
});

var classSchemaModel = mongoose.model("classmanages",classSchema);

module.exports = classSchemaModel;