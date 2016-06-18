var mongoose = require("mongoose");

var shopGoodsSchema = new mongoose.Schema({
	serial_number:Number,	//序号
	goods_name:String,	//商品名称
	class_name:String,	//分类名
	price:String,	//商品价格
	goods_content:[
		{
			shopGoodsUrl:String,	//商品图片
    		name:String,	//原图片名
    		operator:String,	//操作者
    		lastFileName:String		//存储名
		}
	]
});

var shopGoodsModel = mongoose.model("shopgoodsmanages",shopGoodsSchema);

module.exports = shopGoodsModel;