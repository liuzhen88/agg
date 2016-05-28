var config = {
	serverUrl:"http://121.43.57.75:3000",
	dbUrl:"mongodb://121.43.57.75/yimaihui",
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
		}
	},
	path:"public/images/upload/",
	dirname:""
};

module.exports = config;