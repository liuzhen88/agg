window.onload = function(){
	var isAdd = true;
	$(".list").removeClass("has-select");
	$(".list").eq(3).addClass("has-select");
	var thatClassName = "";
	var thatClassId = "";
	if(localStorage.getItem("class")){
		var classData = localStorage.getItem("class");
		classData = JSON.parse(classData);
		thatClassName = classData.className;
		thatClassId = classData.class_id;
		$(".add-new-class-input").val(thatClassName);
		isAdd = false;
	}
	$('.submit-new-class').click(function(){
		var value = $(".add-new-class-input").val();
		if(!value){
			alert("分类名称不能为空");
		}else{
			if(isAdd){
				sendNewClass(value);
			}else{
				var sendName = $(".add-new-class-input").val();
				editClass(sendName,thatClassId);
			}
		}
	});

	function sendNewClass(className){
		$.ajax({
			url:serverUrl+"/users/addNewClass",
			type:"post",
			dataType:"json",
			data:{
				className:className
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("提交成功");
					window.location.href="/classifyManage";
				}else{
					alert(data.message);
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}

	function editClass(className, classId){
		$.ajax({
			url:serverUrl+"/users/editClass",
			type:"post",
			dataType:"json",
			data:{
				className:className,
				class_id:classId
			},
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("更新成功");
					window.location.href="/classifyManage";
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	}
}