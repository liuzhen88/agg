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

                	$(".good-list-container").click(function(){
                		var data = $(this).find("span").text();
                		localStorage.setItem("classData",data);
                		window.location.href="class_detail.html";
                	});
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}
});