var express = require('express');
var router = express.Router();
var upload = require("../service/upload");
var service = require("../service/add");
var serviceForCheck = require("../service/checkLogin");
var classManage = require("../service/classManage");
var annountManage = require("../service/annountManage");
var specialManage = require("../service/specialManage");
var shopGoodsManage = require("../service/shopGoodsManage");
var weixin = require("../service/weixin");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getToken',function(req , res){
	 upload.getToken(req,res).then(function(data){
	 	res.send(data);
	 }).fail(function(err){
	 	res.send(err);
	 });
});

router.post("/uploadSource",function(req, res){
	var imgData = req.body.imgData;
	var fileType = req.body.fileType;
	var fileName = req.body.fileName;
	var Href = req.body.Href;
	upload.uploadSourceForImage(imgData,fileType,fileName,Href,req).then(function(result){
		res.send(result);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/checkLogin",function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	serviceForCheck.checkUserLogin(username,password,req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/add",function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	service.add(username,password).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/exitLogin",function(req, res){
	serviceForCheck.exitLogin(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/modifyPassword",function(req, res){
	serviceForCheck.modify(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/updateBannerHref",function(req, res){
	upload.updateBannerHref(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/deleteBannerFile",function(req, res){
	upload.deleteBannerFileByUrl(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/addNewClass",function(req, res){
	classManage.addNewClassByName(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/editClass",function(req, res){
	classManage.editClassById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/deleteClass",function(req, res){
	classManage.deleteClassByClassId(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/saveNewAnnounce",function(req, res){
	annountManage.saveNewAnnounce(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/delSingleImage",function(req, res){
	annountManage.delSingleImage(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/deleteAnnounceDetails",function(req, res){
	var id = req.query.id;
	annountManage.deleteDetailsById(id).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//公告管理编辑
router.post("/uploadNewFileForNotice",function(req, res){
	annountManage.updateNoticeById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//专题管理添加
router.post("/addSpecial",function(req, res){
	specialManage.uploadSpecialData(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//删除专题
router.get("/deleteSpecialList",function(req, res){
	var id = req.query.id;
	specialManage.deleteSpecialListById(id).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//删除专题图片
router.post("/delSpecialListData",function(req, res){
	specialManage.delSpecialListDataById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//edit special upload files
router.post("/uploadNewFileForSpecial",function(req, res){
	specialManage.uploadNewFileForSpecialById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//add new shop goods
router.post("/addNewShopGoods",function(req, res){
	shopGoodsManage.addNewShopGoods(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//delete shop single goods
router.get("/deleteSingleGoods",function(req, res){
	shopGoodsManage.deleteSingleGoodsById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/deleteSingleImageData",function(req, res){
	shopGoodsManage.deleteSingleImageData(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//update goods for edit
router.post("/updateShopGoods",function(req, res){
	shopGoodsManage.updateShopGoodsById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/getShopGoods",function(req, res){
	shopGoodsManage.getSearchShopGoodsByName(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/addShopModule",function(req, res){
	specialManage.addNewShopModuleById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/delShopModule",function(req, res){
	specialManage.delShopModuleById(req, res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});


/*
	微信端
*/

router.get("/getBannerInfo",function(req,res){
	weixin.getBanner(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

//get notice
router.get("/getNoticeFormApp",function(req,res){
	weixin.getNotice(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/getSingleDetails",function(req,res){
	weixin.getNoticeDetailById(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/getSpecialClassData",function(req, res){
	weixin.getSpecialClassData(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/getSpecialDetail",function(req,res){
	weixin.getSpecialDetailById(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.post("/getShopDetails",function(req,res){
	weixin.getShopDetails(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/getClassData",function(req,res){
	weixin.getClassData(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});


router.post("/getClassListData",function(req, res){
	weixin.getClassListData(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});
	 
//分页
router.get("/getNoticeByPage",function(req,res){
	weixin.getNoticeByPage(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

router.get("/getClassDetailsByWeixin",function(req,res){
	weixin.getClassDetailsByWeixin(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

/*模糊查询*/
router.post("/getVagueData",function(req,res){
	specialManage.getVagueData(req,res).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

module.exports = router;
