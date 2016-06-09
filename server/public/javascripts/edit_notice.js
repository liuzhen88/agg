window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(2).addClass("has-select");
	var doc_w = $(document).width();
	var doc_h = $(window).height();
	$(".loading").css({
		"width":doc_w,
		"height":doc_h
	});
	setImgAttr();
	
	$(".deleteAnnounceForEdit").click(function(){
		var self = this;
		var noticeObjectId = request("noticeId");
		var noticeImageListId = $(this).attr("data-del-id");
		delThisImage(noticeObjectId,noticeImageListId,function(){
			$(self).remove();
		});
	});



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

	function delThisImage(noticeObjectId, noticeImageListId, cb){
		$(".loading").show();
		$.ajax({
			url:serverUrl+"/users/delSingleImage",
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
}

function del(obj){
	var sendDataImage = Gobal.announce;
	var fileName = Gobal.fileName;
	var fileType = Gobal.fileType;
	var index = $(".deleteAnnounce").index(obj);
	$(".previewAnnounce").eq(index).remove();
	sendDataImage.splice(index,1);
	fileName.splice(index,1);
	fileType.splice(index,1);
	console.log(Gobal.announce);
}