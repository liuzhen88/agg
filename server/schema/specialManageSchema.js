var mongoose = require("mongoose");

var specialManage = new mongoose.Schema({
	serial_number:Number,	//序号
	special_name:String,	//专题名称
	// special_class:[
	// 	{
	// 		special_class_name:String	//专题分类
	// 	}
	// ],
	special_class:String,	//专题分类
	special_image:[
		{
			special_image_url:String,	//专题图片url
			name:String,	//源文件名字
			operator:String,	//创建者
			lastFileName:String	//图片源文件被重命名之后的名字
		}
	],
	shop_module:[
		{
			serial_number:String,	//序号
			goods_name:String,	//商品名
			class_name:String,	//商品分类名
			price:String,	//商品价格
			goods_content:[
				{
					shopGoodsUrl:String,	//商品主图
					name:String,		//图片原名
					operator:String,	//创建者
					lastFileName:String	//文件通过buffer后的保存名
				}
			]
		}
	]
});

var specialManageSchema = mongoose.model("specialmanages",specialManage);
 
module.exports = specialManageSchema;