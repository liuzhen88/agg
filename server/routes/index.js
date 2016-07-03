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

router.get("/addNewGoods",function(req, res, next){
	pageRenderHelper.checkSessionForAddGoods(req,res,function(data){
		data.this_position = "商品展示-新增商品";
		res.render('addNewGoods',{data});
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

router.get("/announceManage",function(req, res, next){
	pageRenderHelper.checkSessionForAnnounce(req, res, function(data){
		data.this_position = "公告管理";
		res.render("announceManage",{data});
	});
});

router.get("/addNewAnnounce",function(req, res, next){
	pageRenderHelper.checkSessionForAnnounce(req, res, function(data){
		data.this_position = "公告管理--新增公告";
		res.render("addNewAnnounce",{data});
	});
});

router.get("/editNotice",function(req, res, next){
	var notice_id = req.query.noticeId;
	pageRenderHelper.checkSessionForEditNotice(req, res, notice_id, function(data){
		data.this_position = "公告管理--编辑公告";
		res.render("editNotice",{data});
	});
});

router.get("/specialManage", function(req, res, next){
	pageRenderHelper.checkSessionForSpecialManage(req, res , function(data){
		data.this_position = "专题管理";
		res.render("specialManage",{data});
	});
});

router.get("/addSpecialClass",function(req, res, next){
	pageRenderHelper.checkSessionForSpecialManage(req, res , function(data){
		data.this_position = "专题管理--新增专题";
		console.log(data);
		res.render("addSpecialClass",{data});
	});
});

router.get("/editSpecialList",function(req, res, next){
	pageRenderHelper.checkSessionForSpecialEdit(req, res, function(data){
		data.this_position = "专题管理--编辑专题";
		res.render("editSpecialList",{data});
	});
});

router.get("/editShopGoods",function(req, res, next){
	pageRenderHelper.checkSessionForEidtGoods(req, res, function(data){
		data.this_position = "商品展示-编辑商品";
		res.render("editShopGoods",{data});
	});
});

router.get("/specialShopManage",function(req, res, next){
	pageRenderHelper.checkSessionForSpecialShop(req, res, function(data){
		data.this_position = "专题管理-商品管理";
		res.render("specialShopManage",{data});
	});
});

router.get('/staic/upload',function(req,res){
	res.render('upload',{});
});

router.get("/login",function(req , res, next){
	res.render('login',{});
});

router.get("/pc/index",function(req,res,next){
	pageRenderHelper.pcIndex(req,res,function(data){
		res.render("./pc/index",{data});
	});
	
});

//pc 公告
router.get("/pc/noticeDetail",function(req,res,next){
	pageRenderHelper.pcNotice(req,res,function(data){
		res.render("./pc/noticeDetail",{data});
	});
});

//pc 专题商品
router.get("/pc/specialShop",function(req,res,next){
	pageRenderHelper.pcSpecialShop(req,res,function(data){
		res.render("./pc/specialShop",{data});
	});
});
//分类详情
router.get("/pc/classDetail",function(req,res,next){
	pageRenderHelper.pcClassDetail(req,res,function(data){
		res.render("./pc/classDetail",{data});
	});
});

router.get("/pc/classShopDetail",function(req,res,next){
	pageRenderHelper.pcClassShopDetail(req,res,function(data){
		console.log(data);
		res.render("./pc/classShopDetail",{data});
	});
});

//专题商品详情
router.get("/pc/specialShopDetail",function(req,res,next){
	pageRenderHelper.pcSpecialShopDetail(req,res,function(data){
		res.render("./pc/specialShopDetail",{data});
	});
});

//加入我们
router.get("/pc/join",function(req,res){
	res.render("./pc/join",{});
});

//专题活动
router.get("/pc/specialActive",function(req,res){
	pageRenderHelper.pcSpecialActive(req,res,function(data){
		res.render("./pc/specialActive",{data});
	});
});

module.exports = router;
