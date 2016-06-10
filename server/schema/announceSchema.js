var mongoose = require("mongoose");

var announceSchema = new mongoose.Schema({
	serial_number:Number,	//序号
	noticeName:String,	//公告名称
	noticeImage:[
		{
			noticeImageUrl:String,	//公告图片url
			name:String,	//原本图片名字
			operator:String,		//上传者
			lastFileName:String		//存储名字

		}	
	],
	notice_id:String	//公告id
});

var noticeModel = mongoose.model("noticemanages",announceSchema);

module.exports = noticeModel;