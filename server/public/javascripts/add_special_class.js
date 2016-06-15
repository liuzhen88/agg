var Gobal = {};
window.onload = function(){
	var classArray = [];
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
	$(".list").eq(4).addClass("has-select");
	 
	$(".add-input-img-special").change(function(e){
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

	//新增分类
	$(".add-new-classes").click(function(){
		var subdiv = "<div class='subdiv'>"
					+	"<span>新增分类	:</span>"
					+	"<input type='text' class='new-classes-input' placeholder='请输入新增专题分类名'/>"
					+"</div>";
		$(".new-classes-container").append(subdiv);
	});

	//提交
	$(".submit-data").click(function(){
		var state = confirm("确定要提交吗?");
		if(state){
			$(".new-classes-input").each(function(index,value){
				var text = $(this).val();
				classArray.push(text);
			});
			var specialName = $(".add_special-class-name").val();
			
			if(!specialName){
				alert("专题名称不能为空");
				return;
			}
			if(Gobal.announce.length == 0){
				alert("请上传专题图片");
				return;
			}
			if(classArray.length == 0){
				alert("请添加分类名称");
				return;
			}
			//上传
			$.ajax({
				url:serverUrl+"/users/addSpecial",
				type:"post",
				dataType:"json",
				data:{
					specialName:specialName,
					announce:JSON.stringify(Gobal.announce),
					fileType:JSON.stringify(Gobal.fileType),
					fileName:JSON.stringify(Gobal.fileName),
					classArray:JSON.stringify(classArray)
				},
				json:"callback",
				success:function(data){
					if(data.code == 200){
						classArray = [];
						alert("提交成功");
						window.location.href="/specialManage";
					}
				},
				error:function(err){
					console.log(err);
				}
			});
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