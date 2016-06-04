var Gobal = {};
window.onload = function(){
	Gobal.announce = [];
	Gobal.fileType = [];
	Gobal.fileName = [];
	var doc_w = $(document).width();
	var doc_h = $(window).height();
	$(".loading").css({
		"width":doc_w,
		"height":doc_h
	});
	$(".list").removeClass("has-select");
	$(".list").eq(2).addClass("has-select");
	$(".add-input-img").change(function(e){
		var file = e.target.files[0];
		Gobal.fileName.push(file.name);
		var type = file.type.split("/")[1];
		if(type=="jpeg"){
			type = "jpg";
		}
		Gobal.fileType.push(type);

		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e){
			var source = this.result;
			Gobal.announce.push(source);
			var imgTag = "<div class='previewAnnounce'>"
						+	"<img src="+source+" class='previewAnnounceList'/>"
						+	"<div class='deleteAnnounce' onclick='del(this)'>删除"
						+ 	"</div>"
						+"</div>";
			$(".add-new-announce-img-container").append(imgTag);
			setImgAttr();
		}
	});

	$(".add-announce-submit").click(function(){
		var announceName = $(".add_new_announce-name").val();
		if(!announceName){
			alert("公告标题不能为空");
		}else if(Gobal.announce.length==0){
			alert("请添加图片后再上传");
		}else{
			var state = confirm("确定要上传吗?");
			if(state){
				$(".loading").show();
				$.ajax({
					url:serverUrl+"/users/saveNewAnnounce",
					type:"post",
					dataType:"json",
					data:{
						announceName:announceName,
						announce:JSON.stringify(Gobal.announce),
						fileType:JSON.stringify(Gobal.fileType),
						fileName:JSON.stringify(Gobal.fileName)
					},
					json:"callback",
					success:function(data){
						if(data.code==200){
							$(".loading").hide();
							alert(data.message);
						}
					},
					error:function(err){
						console.log(err);
					}
				});
			}
			
		}
	});

	function setImgAttr(){
		$(".previewAnnounceList").each(function(index,value){
			if($(this).width() > $(".add-new-announce-img-container").width()){
				$(this).width($(".add-new-announce-img-container").width());
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

