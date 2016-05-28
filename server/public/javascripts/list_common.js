$(document).ready(function(){
	$(".list").eq(0).addClass("has-select");
	$(".list").click(function(){
		var index = $(".list").index(this);
		switch(index)
		{
			case 0:
				window.location.href="/indexBanner";
				break;
			case 1:
				window.location.href="/showGoods";
				break;
			case 2:
				window.location.href="/announceManage";
				break;
			case 3:
				window.location.href="/classifyManage";
				break;
			case 4:
				window.location.href="/specialManage";
				break;
		}
	});
});