$(document).ready(function(){
	$(".list").eq(0).addClass("has-select");
	$(".list").click(function(){
		var index = $(".list").index(this);
		switch(index)
		{
			case 0:
				window.location.href="/indexBanner";
				break;
			case 1:
				window.location.href="/showGoods";
				break;
			case 2:
				window.location.href="/announceManage";
				break;
			case 3:
				window.location.href="/classifyManage";
				break;
			case 4:
				window.location.href="/specialManage";
				break;
		}
	});
	$(".exit-login").click(function(){
		exitLogin();
	});

	$(".modfiy-password").click(function(){
		window.location.href="/modifyPassword";
	});

	$(".add-new-class").click(function(){
		if(localStorage.getItem("class")){
			localStorage.removeItem("class");
		}
		window.location.href="/addNewClass";
	});

	function exitLogin(){
		$.ajax({
			url:serverUrl+"/users/exitLogin",
			type:"get",
			dataType:"json",
			json:"callback",
			success:function(data){
				if(data.code==200){
					alert("安全退出成功");
					window.location.href="/login";
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}
});