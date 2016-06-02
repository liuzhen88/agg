window.onload = function(){
	$(".list").eq(0).removeClass("has-select");
	$(".confirm-modify-submit").click(function(){
		var oldPassWord = $(".old-password").val();
		var newPassWord = $(".new-password").val();
		var confirmPassWord = $(".confirm-password").val();
		if(!oldPassWord || !newPassWord || !confirmPassWord){
			alert("请输入完整的密码信息");
		}else{
			if(newPassWord == " "){
				alert("密码不能为空格");
			}else{

				if(newPassWord!=confirmPassWord){
					alert("确认密码和新密码不匹配,请重新输入");
				}else{
					$.ajax({
						url:serverUrl+"/users/modifyPassword",
						type:"post",
						dataType:"json",
						data:{
							oldPassWord:oldPassWord,
							newPassWord:newPassWord
						},
						json:"callback",
						success:function(data){
							if(data.code==200){
								alert("修改成功,请重新登陆");
								window.location.href="/login";
							}else if(data.code==80001){
								alert(data.message);
							}else{
								alert("服务器繁忙,请重试");
							}
						},
						error:function(err){
							console.log(err);
						}
					})
				}
			}
		}
	});
	document.onkeydown = keyevent;

	function keyevent(){
		if(event.keyCode == 13){
			$(".confirm-modify-submit").click();
		}		
	}
}