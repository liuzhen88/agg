$(document).ready(function(){
	var dataId = request("dataId");
	$.ajax({
		url:serverUrl+"/users/getSpecialDetail?dataId="+dataId,
		type:"get",
		dataType:"json",
		json:"callback",
		success:function(data){
			//console.log(data);
			var specialDoTmpl = doT.template($("#special-tmpl").html());
            $("#special").html(specialDoTmpl(data.data));

            $(".details-list-container").click(function(){
            	var shopName = $(this).find(".goodsName").text();
            	var className = $(this).find(".className").text();
            	var datas = {
            		shopName:shopName,
            		className:className
            	};
            	localStorage.setItem("datas",JSON.stringify(datas));
            	window.location.href="shop_detail.html";
            });
		},
		error:function(err){

		}
	});
});