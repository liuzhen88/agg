$(document).ready(function(){

	$.ajax({
		url:serverUrl+"/users/getNoticeFormApp",
		type:"get",
		dataType:"json",
		json:"callback",
		success:function(data){
			if(data.code == 200){
				var noticeDoTmpl = doT.template($("#notice-tmpl").html());
    			$("#noticeDetails").html(noticeDoTmpl(data.data));
    			$(".notice-list").click(function(){
				var id = $(this).attr("id");
					window.location.href = "notice_datails.html?id="+id;
				});
			}
		},
		error:function(err){
			console.log(err);
		}
	});



	
});