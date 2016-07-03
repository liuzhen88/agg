$(document).ready(function(){
	var id = request("id");

	$.ajax({
		url:serverUrl+"/users/getClassDetailsByWeixin?id="+id,
		type:"get",
		dataType:"json",
		json:"callback",
		success:function(data){
			var datas = data.goods_content;
			var goodsDoTmpl = doT.template($("#goods-tmpl").html());
    		$("#goodsBox").html(goodsDoTmpl(datas));
		},
		error:function(err){

		}
	});

	

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
});