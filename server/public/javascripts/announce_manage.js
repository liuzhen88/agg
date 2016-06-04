window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(2).addClass("has-select");
	$(".add-new-announce").click(function(){
		window.location.href = "/addNewAnnounce";
	});
}