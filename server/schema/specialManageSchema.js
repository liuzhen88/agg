var mongoose = require("mongoose");

var specialManage = new mongoose.Schema({
	serial_number:Number,	//序号
	special_name:String,	//专题名称
	special_class:[
		{
			special_class_name:String,	//专题分类
			special_class_id:String		//专题分类id
		}
	],
	special_image:[
		{
			special_image_url:String,	//专题图片url
			name:String,	//源文件名字
			operator:String,	//创建者
			lastFileName:String	//图片源文件被重命名之后的名字
		}
	]
});