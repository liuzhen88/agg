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
		if(state){
			deleteClass();
		}
	});

	function deleteClass(){

	}
}