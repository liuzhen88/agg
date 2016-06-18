window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(1).addClass("has-select");
	$(".add-new-goods").click(function(){
		window.location.href = "/addNewGoods"
	});
	
}