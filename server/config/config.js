var config = {
	serverUrl:"http://121.43.57.75:3000",
	dbUrl:"mongodb://121.43.57.75/yimaihui",
	uploadUrl:"http://121.43.57.75/agg/server/public/images/upload",
	annountUploadUrl:"http://121.43.57.75/agg/server/public/images/annount",
	specialDataPath:"http://121.43.57.75/agg/server/public/images/special/",
	shopGoodsUploadUrl:"http://121.43.57.75/agg/server/public/images/goods",
	data:{
		success:{
			code:"200",
			message:"ok"
		},
		error:{
			code:"500",
			message:"server is error"
		},
		missParameter:{
			code:"400",
			message:"miss parameter"
		},
		notFound:{
			code:"404",
			message:"get data is null"
		},
		notPass:{
			code:"80001",
			message:"原始密码错误"
		},
		hasExit:{
			code:"80001",
			message:"您添加的分类已存在,请重新添加"
		},
		notClassId:{
			code:"80001",
			message:"更新失败,服务器繁忙"
		},
		notFindDeleteObj:{
			code:"80001",
			message:"删除失败,无此记录"
		},
		notCreat:{
			code:"80001",
			message:"添加失败,该分类已存在!"
		}
	},
	path:"public/images/upload/",
	annountPath:"public/images/annount/",
	specialPath:"public/images/special/",
	delPath:"./public/images/special/",
	shopGoodsPath:"public/images/goods/",
	delGoodsPath:"./public/images/goods/",
	dirname:""
};

module.exports = config;