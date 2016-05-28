var express = require('express');
var router = express.Router();
var upload = require("../service/upload");
var service = require("../service/add");
var serviceForCheck = require("../service/checkLogin");

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
	upload.uploadSourceForImage(imgData,fileType,fileName).then(function(result){
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

module.exports = router;
