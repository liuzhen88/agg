window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(2).addClass("has-select");
	$(".add-new-announce").click(function(){
		window.location.href = "/addNewAnnounce";
	});
	$(".announce-edit").click(function(){
		var index = $(".announce-edit").index(this);
		var noticeId = $(".announce-lists-details").eq(index).attr("data-id");
		window.location.href="/editNotice?noticeId="+noticeId;
	});

	$(".announce-del").click(function(){
		var index = $(".announce-del").index(this);
		var _id = $(".announce-lists-details").eq(index).attr("data-id");
		deleteAnnounceAllData(_id,function(){

		});
	});


	function deleteAnnounceAllData(id, callback){
		$.ajax({
			url:serverUrl+"/users/deleteAnnounceDetails?id="+id,
			type:"get",
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code == 200){
					alert("删除成功");
					callback();
				}else{
					alert("服务器繁忙,请稍后再试");
				}
			},
			error:function(err){
				alert(err);
			}
		});
	}
}