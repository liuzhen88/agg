window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(4).addClass("has-select");
	$("#addNewSpecial").click(function(){
		window.location.href="/addSpecialClass";
	});
}