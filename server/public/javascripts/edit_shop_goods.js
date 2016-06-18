window.onload = function(){
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


	function deleteSingleImage(id, delId, callback){
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
}