var gobal = {};
window.onload = function(){	
	gobal.sendDataImage = [];
	gobal.sendFileName = [];
	gobal.sendFileType = [];
	// var h = $(".imgs-container").height();
	// var hh = $(".container-right").height();
	// $(".container-right").height(h+hh+30);
	// $(".container-left").height(h+hh+30);
	var upload = document.getElementById("upload");
	upload.onchange = function(e){
		var file = e.target.files[0];
		var fileName = file.name;
		gobal.sendFileName.push(fileName);
		var fileType = file.type.split("/")[1];
		if(fileType=="jpeg"){
			fileType = "jpg";
		}
		gobal.sendFileType.push(fileType);
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e){
			// var result = document.getElementById("result");
			var source = this.result;
			console.log(source);
			gobal.sendDataImage.push(source);
			// result.setAttribute("src",source);
			var imgTag = "<div class='previewListContainer'>"
						+	"<img src="+source+" class='previewList'/>"
						+	"<div class='delete' onclick='del(this)'>删除"
						+ 	"</div>"
						+"</div>";
						
			$(".preview-img-container").append(imgTag);
			isShowpreviewContainer();
			setImgAttr();
		}
	}
	$("#btn").click(function(){
		uploadSource(gobal.sendDataImage,gobal.sendFileName,gobal.sendFileType);
	});	
	function uploadSource(imgData,fileName,fileType){
		$.ajax({
			url:serverUrl+"/users/uploadSource",
			type:"post",
			data:{
				imgData:JSON.stringify(imgData),
				fileType:JSON.stringify(fileType),
				fileName:JSON.stringify(fileName)
			},
			dataType:"json",
			json:"callback",
			success:function(data){
				alert(data.message);
				console.log(data);
			},
			error:function(err){
				console.log(err);
			}
		});
	}
	$(".banner-data-url").each(function(index,value){
		if($(this).width()>$(".container-right").width()){
			$(this).width($(".container-right").width());
		}
	});

	$(".edit").click(function(){
		var index = $(".edit").index(this);
		$(".img-href").eq(index).removeAttr("readonly");
		$(".img-href").eq(index).removeClass("disable");

	});

	$(".save").click(function(){
		var index = $(".save").index(this);
		var attr = $(".img-href").eq(index).attr("readonly");
		var dataId = $(".banner-data-url").eq(index).attr("data-id");
		if(attr){
			alert("您暂未修改跳转链接");
			return;
		}
		var newHref = $(".img-href").eq(index).val();
		updateHref(newHref,dataId,function(){
			$(".img-href").eq(index).attr("readonly","readonly");
			$(".img-href").eq(index).addClass("disable");
		});
		
	});

	$(".del").click(function(){
		var index = $(".del").index(this);
		var dataId = $(".banner-data-url").eq(index).attr("data-id");
		var src = $(".banner-data-url").eq(index).attr("src");
		var state = confirm("确定要删除吗?");
		if(state){
			delBannerFile(dataId,src);
		}
	});

	function updateHref(newHref, dataId, cb){
		$.ajax({
			url:serverUrl+"/users/updateBannerHref",
			type:"post",
			dataType:"json",
			data:{
				newHref:newHref,
				dataId:dataId
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("保存成功");
					cb();
				}
			},
			error:function(err){
				console.log(err);
			}

		});
	}

	function delBannerFile(dataId, src){
		$.ajax({
			url:serverUrl+"/users/deleteBannerFile",
			type:"post",
			dataType:"json",
			data:{
				dataId:dataId,
				path:src
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("删除成功");
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}
}
function del(obj){
	var sendDataImage = gobal.sendDataImage;
	var fileName = gobal.sendFileName;
	var fileType = gobal.sendFileType;
	var index = $(".delete").index(obj);
	$(".previewListContainer").eq(index).remove();
	sendDataImage.splice(index,1);
	fileName.splice(index,1);
	fileType.splice(index,1);
	isShowpreviewContainer();
}

function isShowpreviewContainer(){
	if($(".previewListContainer").length>0){
		$(".preview-title").show();
		$(".upload-file").show();
	}else{
		$(".preview-title").hide();
		$(".upload-file").hide();
	}
}

function setImgAttr(){
	$(".previewList").each(function(index,value){
		if($(this).width() > $(".container-right").width()){
			$(this).width($(".container-right").width());
		}
	});
}