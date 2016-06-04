var config = {
	serverUrl:"http://121.43.57.75:3000",
	dbUrl:"mongodb://121.43.57.75/yimaihui",
	uploadUrl:"http://121.43.57.75/agg/server/public/images/upload",
	annountUploadUrl:"http://121.43.57.75/agg/server/public/images/annount",
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
		}
	},
	path:"public/images/upload/",
	annountPath:"public/images/annount/",
	dirname:""
};

module.exports = config;