window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(1).addClass("has-select");
	$(".add-new-goods").click(function(){
		window.location.href = "/addNewGoods"
	});

	$(".delete-goods").click(function(){
		var id = $(this).attr("data-id");
		var index = $(".delete-goods").index(this);
		var state = confirm("确定要删除吗?");
		if(state){
			deleteGoodsData(id,function(){
				$(".goods-lists-container").eq(index).remove();
			});
		}	
	});

	//编辑
	$(".edit-goods").click(function(){
		var id = $(this).attr("data-id");
		window.location.href="/editShopGoods?id="+id;
	});

	function deleteGoodsData(id, callback){
		$.ajax({
			url:serverUrl+"/users/deleteSingleGoods?id="+id,
			type:"get",
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code == 200){
					alert("删除成功");
					callback();
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}
}