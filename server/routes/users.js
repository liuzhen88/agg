var express = require('express');
var router = express.Router();
var upload = require("../service/upload");
var service = require("../service/add");
var serviceForCheck = require("../service/checkLogin");
var classManage = require("../service/classManage");
var annountManage = require("../service/annountManage");


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

app.get("/deleteAnnounceDetails",function(req, res){
	var id = req.query.id;
	annountManage.deleteDetailsById(id).then(function(data){
		res.send(data);
	}).fail(function(err){
		res.send(err);
	});
});

module.exports = router;
