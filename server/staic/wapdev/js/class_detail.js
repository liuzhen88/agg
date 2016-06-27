$(document).ready(function(){
	var data = localStorage.getItem("classData");
	data = JSON.parse(data);
	var goodsDoTmpl = doT.template($("#goods-tmpl").html());
    $("#goodsBox").html(goodsDoTmpl(data));
});