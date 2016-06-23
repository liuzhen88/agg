$(document).ready(function(){
	var id = request("id");


	$.ajax({
		url:serverUrl+"/users/getSingleDetails?id="+id,
		type:"get",
		dataType:"json",
		json:"callback",
		success:function(data){
			if(data.code==200){
				var noticeDoTmpl = doT.template($("#notice-details-tmpl").html());
			    $("#noticeDetails").html(noticeDoTmpl(data.data));
			}
		},
		error:function(err){

		}
	})
});