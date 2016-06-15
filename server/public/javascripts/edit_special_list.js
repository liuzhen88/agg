var AGG = {};
window.onload = function(){
	AGG.sendDataImage = [];
	AGG.sendFileName = [];
	AGG.sendFileType = [];
	$(".list").removeClass("has-select");
	$(".list").eq(4).addClass("has-select");
	var doc_w = $(document).width();
	var doc_h = $(window).height();
	$(".loading").css({
		"width":doc_w,
		"height":doc_h
	});

	$(".add-input-img").change(function(e){
		var file = e.target.files[0];
		var fileName = file.name;
		AGG.sendFileName.push(fileName);
		var fileType = file.type.split("/")[1];
		if(fileType=="jpeg"){
			fileType = "jpg";
		}
		AGG.sendFileType.push(fileType);
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e){
			var source = this.result;
			AGG.sendDataImage.push(source);
			var imgTag = "<div class='previewListContainer'>"
						+	"<img src="+source+" class='previewList'/>"
						+	"<div class='delete' onclick='del(this)'>删除"
						+ 	"</div>"
						+"</div>";
			$(".edit-new-announce-img-container").append(imgTag);
			setImgAttr();
			//console.log(AGG.sendDataImage);
		}
	});

	setImgAttr();


	$(".deleteAnnounceForEdit").click(function(){
		var self = this;
		var index = $(".deleteAnnounceForEdit").index(this);
		var noticeObjectId = request("id");
		var noticeImageListId = $(this).attr("data-del-id");
		delThisImage(noticeObjectId,noticeImageListId,function(){
			$(".previewAnnounce").eq(index).remove();
		});
	});

	$(".add-announce-submit").click(function(){
		var sendDataImage = AGG.sendDataImage;
		var sendFileName = AGG.sendFileName;
		var sendFileType = AGG.sendFileType;
		if(sendDataImage.length == 0){
			alert("您暂未添加新图片");
		}else{
			var id = request("id");
			uploadNewFileImage(id,sendDataImage,sendFileName,sendFileType,function(){
				window.location.href="/specialManage";
			});
		}
	});


	function uploadNewFileImage(id, sendDataImage, sendFileName, sendFileType, cb){
		$.ajax({
			url:serverUrl+"/users/uploadNewFileForSpecial",
			type:"post",
			dataType:"json",
			data:{
				announce:JSON.stringify(sendDataImage),
				fileName:JSON.stringify(sendFileName),
				fileType:JSON.stringify(sendFileType),
				id:id
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("提交成功");
					cb();
				}else{
					alert("服务器繁忙,请稍后再试");
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	function delThisImage(noticeObjectId, noticeImageListId, cb){
		$(".loading").show();
		$.ajax({
			url:serverUrl+"/users/delSpecialListData",
			type:"post",
			dataType:"json",
			data:{
				noticeObjectId:noticeObjectId,
				noticeImageListId:noticeImageListId
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					$(".loading").hide();
					alert("删除成功");
					cb();
				}else{
					$(".loading").hide();
					alert("删除失败，无此记录");
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}


	function setImgAttr(){
		$(".previewAnnounceList").each(function(index,value){
			if($(this).width() > $(".edit-new-announce-img-container").width()){
				$(this).width($(".edit-new-announce-img-container").width());
			}
		});
	}



	function request(paras) {
	    var url = location.href;
	    url = decodeURI(url);
	    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	    var paraObj = {};
	    for (var i = 0; j = paraString[i]; i++) {
	        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	    }
	    var returnValue = paraObj[paras.toLowerCase()];
	    if (typeof(returnValue) == "undefined") {
	        return "";
	    } else {
	        return returnValue;
	    }
	}
}
function del(obj){
	var sendDataImage = AGG.sendDataImage;
	var fileName = AGG.sendFileName;
	var fileType = AGG.sendFileType;
	var index = $(".delete").index(obj);
	$(".previewListContainer").eq(index).remove();
	sendDataImage.splice(index,1);
	fileName.splice(index,1);
	fileType.splice(index,1);
 	//console.log(AGG.sendDataImage);
}