var AGG = {};
window.onload = function(){
	AGG.sendDataImage = [];
	AGG.sendFileName = [];
	AGG.sendFileType = [];
	var doc_w = $(document).width();
	var doc_h = $(window).height();
	$(".loading").css({
		"width":doc_w,
		"height":doc_h
	});
	$(".list").removeClass("has-select");
	$(".list").eq(1).addClass("has-select");
	var id = request("id");
	//delete
	$(".deleteAnnounceForEdit").click(function(){
		var index = $(".deleteAnnounceForEdit").index(this);
		var delId = $(this).attr("data-del-id");
		var state = confirm("确定要删除吗?");
		if(state){
			deleteSingleImage(id,delId,function(){
				$(".previewAnnounce").eq(index).remove();
			});
		}
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
			console.log(AGG.sendDataImage);
		}
	});

	setImgAttr();

	$(".add-announce-submit").click(function(){
		var sendDataImage = AGG.sendDataImage;
		var sendFileName = AGG.sendFileName;
		var sendFileType = AGG.sendFileType;
		if(sendDataImage.length == 0){
			alert("您暂未添加新图片");
		}else{
			if(!$(".add_new_announce-name").val()){
				alert("请输入商品名称");
				return;
			}
			var id = request("id");
			var goods_name = $(".add_new_announce-name").val();
			var class_name = $("#className").val();
			uploadNewFileImage(id,goods_name,class_name,function(){
				window.location.href="/showGoods";
			});
		}
	});

	function uploadNewFileImage(id, goodsName, className, cb){
		$(".loading").show();
		$.ajax({
			url:serverUrl+"/users/updateShopGoods",
			type:"post",
			data:{
				id:id,
				goodsName:goodsName,
				className:className,
				announce:JSON.stringify(AGG.sendDataImage),
				fileName:JSON.stringify(AGG.sendFileName),
				fileType:JSON.stringify(AGG.sendFileType)
			},
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code == 200){
					$(".loading").hide();
					alert("提交成功");
					cb();
				}else{
					alert(data.message);
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}

	function deleteSingleImage(id, delId, callback){
		$(".loading").show();
		$.ajax({
			url:serverUrl+"/users/deleteSingleImageData",
			type:"post",
			data:{
				id:id,
				delId:delId
			},
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code == 200){
					$(".loading").hide();
					alert('删除成功');
					callback();
				}else{
					alert(data.message);
				}
			},
			error:function(err){
				console.log(err);
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

	function setImgAttr(){
		$(".previewAnnounceList").each(function(index,value){
			if($(this).width() > $(".edit-new-announce-img-container").width()){
				$(this).width($(".edit-new-announce-img-container").width());
			}
		});
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
 	console.log(AGG.sendDataImage);
}