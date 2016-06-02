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

router.get('/staic/upload',function(req,res){
	res.render('upload',{});
});

router.get("/login",function(req , res, next){
	res.render('login',{});
})

module.exports = router;
