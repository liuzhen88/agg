var Gobal = {};
window.onload = function(){
	Gobal.announce = [];
	Gobal.fileType = [];
	Gobal.fileName = [];
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

			console.log(Gobal.announce);
		}
	});

	$(".add-announce-submit").click(function(){
		var announceName = $(".add_new_announce-name").val();
		if(!announceName){
			alert("公告标题不能为空");
		}else{
			var state = confirm("确定要上传吗?");
			if(state){
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

