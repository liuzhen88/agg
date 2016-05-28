var gobal = {};
window.onload = function(){	
	gobal.sendDataImage = [];
	gobal.sendFileName = [];
	gobal.sendFileType = [];
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
				console.log(data);
			},
			error:function(err){
				console.log(err);
			}
		});
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