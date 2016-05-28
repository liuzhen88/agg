$(document).ready(function(){
	$("#btn").click(function(){
		var username = $("#username").val();
		var password = $("#password").val();
		if(!username || !password){
			alert("用户名或密码不能为空");
		}else{
			$.ajax({
				url:serverUrl+"/users/checkLogin",
				type:"post",
				data:{
					username:username,
					password:password
				},
				dataType:"json",
				json:"callback",
				success:function(data){
					if(data.code=="200"){
						addcookie("session.id",data.session.id);
						window.location.href="/indexBanner";	
					}else{
						alert(data.message);
					}
				},
				error:function(err){
					alert(err.message);
				}
			});
		}
	});
	$("#add").click(function(){
		var username = $("#username").val();
		var password = $("#password").val();
		if(!username || !password){
			alert("请填写完整的信息");
		}else{
			$.ajax({
				url:serverUrl+"/users/add",
				type:"post",
				data:{
					username:username,
					password:password
				},
				dataType:"json",
				json:"callback",
				success:function(data){
					alert("添加成功");
				},
				error:function(err){

				}
			});
		}
	});
});