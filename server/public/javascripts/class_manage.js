window.onload = function(){
	$(".list").removeClass("has-select");
	$(".list").eq(3).addClass("has-select");

	$(".class-edit").click(function(){
		var index = $(".class-edit").index(this);
		var class_id = $(".class-lists-details").eq(index).attr("data-class-id");
		var className = $(".class-lists-value").eq(index).val();
		var classData = {
			class_id:class_id,
			className:className
		};
		localStorage.setItem("class",JSON.stringify(classData));
		window.location.href = "/editClass";
	});

	$(".class-del").click(function(){
		var state = confirm("确定要删除吗?");
		var index = $(".class-del").index(this);
		var class_id = $(".class-lists-details").eq(index).attr("data-class-id");
		if(state){
			deleteClass(class_id,index);
		}
	});

	function deleteClass(classId,index){
		$.ajax({
			url:serverUrl+"/users/deleteClass",
			type:"post",
			dataType:"json",
			data:{
				class_id:classId
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("删除成功");
					$(".class-lists-details").eq(index).remove();
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}
}