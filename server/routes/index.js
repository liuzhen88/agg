var express = require('express');
var router = express.Router();
var pageRenderHelper = require("../service/pageRenderHelper");

// router.get('/index', function(req, res, next) {
// 	pageRenderHelper.checkSession(req, res, function(data){
// 		res.render('index', {data});
// 	});
// });

router.get("/indexBanner",function(req,res,next){
	pageRenderHelper.checkSession(req, res, function(data){
		data.this_position="首页广告图";
		res.render('indexBanner', {data});
	});
})

router.get("/modifyPassword",function(req,res,next){
	pageRenderHelper.checkSession(req,res,function(data){
		data.this_position = "修改密码";
		res.render('modifyPassword',{data});
	});
});

router.get("/showGoods",function(req,res,next){
	pageRenderHelper.checkSessionForShowGoods(req,res,function(data){
		data.this_position = "商品展示";
		res.render('showGoods',{data});
	});
});



router.get("/classifyManage",function(req, res, next){
	pageRenderHelper.checkSessionForClassManage(req,res,function(data){
		data.this_position = "分类管理";
		res.render('classifyManage',{data});
	});
});

router.get("/addNewClass",function(req, res, next){
	pageRenderHelper.checkSessionForClasses(req,res,function(data){
		data.this_position = "分类管理--新增分类";
		res.render('addNewClass',{data});
	});
});

router.get("/editClass",function(req, res, next){
	pageRenderHelper.checkSessionForClasses(req, res, function(data){
		data.this_position = "分类管理--编辑分类";
		res.render('editClass',{data});
	});
});

router.get('/staic/upload',function(req,res){
	res.render('upload',{});
});

router.get("/login",function(req , res, next){
	res.render('login',{});
})

module.exports = router;
