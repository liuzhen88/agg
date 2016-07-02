window.onload = function(){
	$(".shop-images-containers").click(function(){
		var id = $(this).attr("data-id");
		window.location.href="/pc/classShopDetail?id="+id;
	});
}