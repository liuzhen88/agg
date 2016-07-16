var Gobal = {};
window.onload = function(){
	Gobal.announce = [];
	Gobal.fileType = [];
	Gobal.fileName = [];
	Gobal.count = [];
	Gobal.h = [];
	Gobal.index = 0;
	var doc_w = $(document).width();
	var doc_h = $(window).height();
	$(".loading").css({
		"width":doc_w,
		"height":doc_h
	});
	$(".list").removeClass("has-select");
	$(".list").eq(1).addClass("has-select");
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
						+	"<div class='move-up' onclick='moveUp(this)' data-index="+Gobal.index+">上移</div>"
						+	"<div class='move-down' onclick='moveDown(this)' data-index="+Gobal.index+">下移</div>"
						+"</div>";
			$(".add-new-announce-img-container").append(imgTag);
			setImgAttr();
			Gobal.count.push(Gobal.index);
			 
			Gobal.h.push($(".previewAnnounceList").eq(Gobal.index).height());
			Gobal.index++;

		}
		
	});

	function setImgAttr(){
		$(".previewAnnounceList").each(function(index,value){
			if($(this).width() > $(".add-new-announce-img-container").width()){
				$(this).width($(".add-new-announce-img-container").width());
			}
		});
	}

	$("#addNewGoods").click(function(){
		var state = confirm("确定要上传吗?");
		if(state){
			var goodsName = $(".add_new_announce-name").val();
			var className = $("#className").val();
			var price = $(".add_new_announce-price").val();
			var qz = $(".qz").val();//权重
			if(!goodsName){
				alert("请输入商品名称");
				return;
			}
			if(!className){
				alert("分类名不能为空");
				return;
			}
			if(Gobal.announce.length == 0){
				alert("请添加图片");
				return;
			}
			//去除商品价格验证
			// if(!price){
			// 	alert("请输入商品价格");
			// 	return;
			// }
			//变换
			var announces = [];
			var fileTypes = [];
			var fileNames = [];
			Gobal.count.forEach(function(value,index){
				announces.push(Gobal.announce[value]);
				fileTypes.push(Gobal.fileType[value]);
				fileNames.push(Gobal.fileName[value]);
			});

			$(".loading").show();
			$.ajax({
				url:serverUrl+"/users/addNewShopGoods",
				type:"post",
				data:{
					goodsName:goodsName,
					className:className,
					price:price,
					announce:JSON.stringify(announces),
					fileType:JSON.stringify(fileTypes),
					fileName:JSON.stringify(fileNames),
					qz:qz
				},
				dataType:"json",
				json:"callback",
				success:function(data){
					if(data.code == 200){
						$(".loading").hide();
						alert("添加成功");
						window.location.href="/showGoods";
					}
				},
				error:function(err){
					console.log(err);
				}
			});
		}
	});
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
	Gobal.h.splice(index,1);
	Gobal.index --;
	Gobal.count.splice(index,1);
}

function moveUp(obj){

	var dataIndex = $(obj).attr("data-index");
	dataIndex = Number(dataIndex);

	var index = $.inArray(dataIndex,Gobal.count);	//重新排列之后在队列里面的位置
	var net = Gobal.count[index-1];
	if(index!=0){
		var arr = exchange(Gobal.count,index,index-1);
		Gobal.count = arr;
		var pdd = Gobal.count[index-1];

		index = $.inArray(dataIndex,Gobal.count);

		var nextIndex = $.inArray(net,Gobal.count);
		
		animation(dataIndex,index,net,nextIndex);
	}
}

function moveDown(obj){

	var allLength = $(".previewAnnounce").length;
	var dataIndex = $(obj).attr("data-index");
	dataIndex = Number(dataIndex);
	var index = $.inArray(dataIndex,Gobal.count);	//重新排列之后在队列里面的位置
	var net = Gobal.count[index+1];
	if(index!=allLength-1){
		var arr = exchange(Gobal.count,index,index+1);
		Gobal.count = arr;
		var pdd = Gobal.count[index+1];

		index = $.inArray(dataIndex,Gobal.count);

		var nextIndex = $.inArray(net,Gobal.count);
		
		animation(dataIndex,index,net,nextIndex);
		
	}
}

function exchange(arr, index1, index2){
	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

function animation(oldIndex, newIndex, nextOldIndex,nextNewIndex){

	if(oldIndex<=newIndex){
		//下移,top为正
		var downDistance = 0;
		for(var i=oldIndex+1;i<=newIndex;i++){
			downDistance = downDistance + Gobal.h[i] + 15;
		}
		$(".previewAnnounce").eq(oldIndex).animate({
			"top":downDistance
		},1000);
	}
	if(nextOldIndex<=nextNewIndex){
		//下移,top为正
		var downDistance = 0;
		for(var i=nextOldIndex+1;i<=nextNewIndex;i++){
			downDistance = downDistance + Gobal.h[i] + 15;
		}
		$(".previewAnnounce").eq(nextOldIndex).animate({
			"top":downDistance
		},1000);
	}
	if(oldIndex>newIndex){
		//上移,top为负
		var upDistance = 0;
		for(var i=newIndex;i<oldIndex;i++){
			upDistance = upDistance + Gobal.h[i] + 15;
		}
		$(".previewAnnounce").eq(oldIndex).animate({
			"top":-upDistance
		},1000);
	}
	if(nextOldIndex>nextNewIndex){
		//上移,top为负
		var upDistance = 0;
		for(var i=nextNewIndex;i<nextOldIndex;i++){
			upDistance = upDistance + Gobal.h[i] + 15;
		}
		$(".previewAnnounce").eq(nextOldIndex).animate({
			"top":-upDistance
		},1000);
	}
	if(oldIndex == newIndex){
		//不动,不需做任何处理
	}
}