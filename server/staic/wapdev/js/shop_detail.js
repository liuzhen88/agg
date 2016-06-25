$(document).ready(function(){
	var datas = localStorage.getItem("datas");
	datas = JSON.parse(datas);
	var goodsName = datas.shopName;
	var className = datas.className;
	$.ajax({
		url:serverUrl+"/users/getShopDetails",
		type:"post",
		data:{
			goodsName:goodsName,
			className:className
		},
		dataType:"json",
		json:"callback",
		success:function(data){
			console.log(data);
			if(data.code == 200){
				var specialDoTmpl = doT.template($("#GoodsDetail-tmpl").html());
            	$("#GoodsDetail").html(specialDoTmpl(data.data));
			}
		},
		error:function(err){

		}
	});
});