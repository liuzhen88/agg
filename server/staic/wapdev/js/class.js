var flag = 0;
$(document).ready(function(){
	$.ajax({
		url:serverUrl+"/users/getClassData",
		type:"get",
		dataType:"json",
		success:function(data){
			if(data.code==200){
				var classDoTmpl = doT.template($("#class-tmpl").html());
                $("#classBox").html(classDoTmpl(data.data));

                $(".classList").click(function(){
                	$(".classList").removeClass("has-select");
                	$(this).addClass("has-select");
                	var text = $(this).text();
                	getClassListData(text);
                });
			}
		},
		error:function(err){
			console.log(err);
		}
	});

	$(".more").click(function(){
		$(".all").toggle();
	});

	function getClassListData(text){
		$(".all").hide();
		$.ajax({
			url:serverUrl+"/users/getClassListData",
			type:"post",
			data:{
				text:text
			},
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code==200){
					var goodsDoTmpl = doT.template($("#goods-tmpl").html());
                	$("#goodsBox").html(goodsDoTmpl(data.data));

     
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}
});

function getDetail(obj){
	
	
	if(flag == 0){
		var id = $(obj).attr("data-id");
		alert(id);
		window.location.href="class_detail.html?id="+id;
	}
	flag ++;
    
}