window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(4).addClass("has-select");
	$("#addNewSpecial").click(function(){
		window.location.href="/addSpecialClass";
	});
	$(".special-delete").click(function(){
		var id = $(this).attr("data-id");
		var index = $(".special-delete").index(this);
		var state = confirm("确定要删除吗?");
		if(state){
			$.ajax({
				url:serverUrl+"/users/deleteSpecialList?id="+id,
				type:"get",
				dataType:"json",
				json:"callback",
				success:function(data){
					if(data.code==200){
						alert("删除成功");
						//$(".special-class-lists-details").eq(index).remove();
						window.location.reload();
					}
				},
				error:function(err){
					console.log(err);
				}
			});
		}
	});
	//编辑
	$(".special-edit").click(function(){
		var id = $(this).attr("data-id");
		window.location.href="/editSpecialList?id="+id;
	});

	//商品
	$(".special-shop").click(function(){
		var id = $(this).attr("data-id");
		window.location.href="/specialShopManage?id="+id;
	});
}