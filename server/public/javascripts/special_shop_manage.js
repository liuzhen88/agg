window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(4).addClass("has-select");
	$(".confimr-search").click(function(){
		var result = $("#result").val();
		if(!result){
			alert("请输入查询商品");
			return;
		}
		$(".shop-goods-lists").remove();
		getSearchShopGoods(result);
	});

	/*模糊查询*/
	$("#result").keyup(function(){
		var keyWords = $(this).val();
		if(keyWords!=""){
			$.ajax({
				url:serverUrl+"/users/getVagueData",
				type:"post",
				data:{
					keyWords:keyWords
				},
				dataType:"json",
				json:"callback",
				success:function(data){
					$(".vague-container").show();
					$(".vague-list").remove();
					for(var i=0;i<data.length;i++){
						var vagueList = "<div class='vague-list'>"+data[i].goods_name+"</div>"
						$(".vague-container").append(vagueList);
					}
					$(".vague-list").click(function(){
						var v = $(this).text();
						$("#result").val(v);
						$(".vague-container").hide();
					});
				},
				error:function(err){
					console.log(err);
				}
			});
		}else{
			$(".vague-container").hide();
		}
		
	});

	$(".del-shop-goods-module").click(function(){
		var state = confirm("确定要删除吗?");
		if(state){
			var id = $(this).attr("data-id");
			var index = $(".del-shop-goods-module").index(this);
			delSingleShopModule(id,function(){
				$(".shop-goods-module-lists").eq(index).remove();
			});
		}	
	});

	function getSearchShopGoods(result){
		$(".load-ajax").show();
		$.ajax({
			url:serverUrl+"/users/getShopGoods",
			type:"post",
			data:{
				name:result
			},
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code == 200){
					$(".load-ajax").hide();
					$(".no-found").hide();
					data.lists.forEach(function(value,index){
						var subdiv = "<div class='shop-goods-lists'>"
								+"	<div class='shop-goods-lists-image'>"
								+"		<img src='"+value.goods_content[0].shopGoodsUrl+"'/>"
								+"	</div>"
								+"	<div class='shop-goods-lists-attr'>"
								+"		<div class='shop-goods-lists-name'>"+value.goods_name+"</div>"
								+"		<div class='shop-goods-lists-price'>"+value.price+"</div>"
								+"	</div>"
								+"	<div class='shop-goods-lists-action'>"
								+"			<button class='add' data-id='"+value._id+"'>添加</button>"
								+"	</div>"
								+"</div>"
								+"<div class='clear'></div>";
						$(".result-shop-container").append(subdiv);
					});

					$(".add").click(function(){
						var id = $(this).attr("data-id");
						addNewShopModule(id);
					});
					
				}else{
					$(".load-ajax").hide();
					$(".no-found").show();
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}

	function addNewShopModule(id){
		var mainId = request("id");
		$.ajax({
			url:serverUrl+"/users/addShopModule?mainId="+mainId+"&id="+id,
			type:"get",
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("添加成功");
					window.location.reload();
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

	function delSingleShopModule(id,callback){
		var mainId = request("id");
		$.ajax({
			url:serverUrl+"/users/delShopModule?mainId="+mainId+"&id="+id,
			type:"get",
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code == 200){
					alert("删除成功");
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
}