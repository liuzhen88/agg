window.onload = function(){
	$(".special-container-images-container").click(function(){
		var id = $(this).attr("data-id");
		window.location.href="/pc/specialShop?dataId="+id;
	});
	$(".headers").eq(1).addClass("select");
}