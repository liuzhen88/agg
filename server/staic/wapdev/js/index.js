$(document).ready(function(){
	var width = $(window).width();
	$("#swipeBox").css({
		"height":width/2
	});
	 $.ajax({
        url: serverUrl+"/users/getBannerInfo",
        type: 'get',
        dataType: 'json',
        json:"callback",
        success: function (result) {
        	if (result.code == 200) {
        		console.log(result);
        		//banner广告位渲染
                var swipeDoTmpl = doT.template($("#swipe-tmpl").html());
                $("#swipeBox").html(swipeDoTmpl(result.data.banner));
                $('.adv_list').each(function () {
                    if ($(this).find('.item').length < 2) {
                        return;
                    }
                    Swipe(this, {
                        startSlide: 1,
                        speed: 400,
                        auto: 3000,
                        continuous: true,
                        disableScroll: false,
                        stopPropagation: false,
                        callback: function (index, elem) {
                        },
                        transitionEnd: function (index, elem) {
                        }
                    });
                });
        	}
        }
    });
	$(".notice").click(function(){
		window.location.href = "notice.html";
	});
});