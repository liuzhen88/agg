// var flag = 0;
// $(document).ready(function(){
// 	$.ajax({
// 		url:serverUrl+"/users/getClassData",
// 		type:"get",
// 		dataType:"json",
// 		success:function(data){
// 			if(data.code==200){
// 				var classDoTmpl = doT.template($("#class-tmpl").html());
//                 $("#classBox").html(classDoTmpl(data.data));

//                 $(".classList").click(function(){
//                 	$(".classList").removeClass("has-select");
//                 	$(this).addClass("has-select");
//                 	var text = $(this).text();
//                 	getClassListData(text);
//                 });
// 			}
// 		},
// 		error:function(err){
// 			console.log(err);
// 		}
// 	});

// 	$(".more").click(function(){
// 		$(".all").toggle();
// 	});

// 	function getClassListData(text){
// 		$(".all").hide();
// 		$.ajax({
// 			url:serverUrl+"/users/getClassListData",
// 			type:"post",
// 			data:{
// 				text:text
// 			},
// 			dataType:"json",
// 			json:"callback",
// 			success:function(data){
// 				if(data.code==200){
// 					var goodsDoTmpl = doT.template($("#goods-tmpl").html());
//                 	$("#goodsBox").html(goodsDoTmpl(data.data));

     
// 				}
// 			},
// 			error:function(err){
// 				console.log(err);
// 			}
// 		});
// 	}
// });

// function getDetail(obj){
	
// 	if(flag == 0){
// 		var id = $(obj).attr("data-id");
// 		window.location.href="class_detail.html?id="+id;
// 	}
// 	flag ++;
    
// }

$(document).ready(function(){
	var height = $(window).height();
	$(".class-list").height(height-60);

	$.ajax({
		url:serverUrl+"/users/getClassData",
		type:"get",
		dataType:"json",
		json:"callback",
		success:function(data){
			 if(data.code == 200){
			 	var goodsDoTmpl = doT.template($("#class-tmpl").html());
                $("#classBox").html(goodsDoTmpl(data.data));
                if(data.data.length>0){
                	var firstClassName = data.data[0].className;
                	getClassDetail(firstClassName);
                }
                $(".class-list-name").click(function(){
					$(".class-list-name").removeClass("active");
					$(this).addClass("active");
					var text = $(this).text();
					getClassDetail(text);
				});
			 }
		},
		error:function(err){

		}
	});

	
	function getClassDetail(text){
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

                	$(".class-detail-container").click(function(){
                		var id = $(this).attr("data-id");
                		window.location.href="class_detail.html?id="+id;
                	});
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}
});