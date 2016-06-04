window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(2).addClass("has-select");
	$(".add-new-announce").click(function(){
		window.location.href = "/addNewAnnounce";
	});
	$(".announce-edit").click(function(){
		var index = $(".announce-edit").index(this);
		var noticeId = $(".announce-lists-details").eq(index).attr("data-id");
		window.location.href="/editNotice?noticeId="+noticeId;
	});
}