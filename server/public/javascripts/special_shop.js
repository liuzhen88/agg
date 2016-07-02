window.onload = function(){
	$(".shop-images-containers").click(function(){
		var special_name = $(this).find(".special-name").text();
		var special_class = $(this).find(".special-class").text();
		var module_id = $(this).find(".module-id").text();
		special_name = encodeURIComponent(special_name);
		special_class = encodeURIComponent(special_class);

		window.location.href="/pc/specialShopDetail?special_name="+special_name+"&special_class="+special_class+"&module_id="+module_id;
	});
}