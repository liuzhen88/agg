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