window.onload = function(){ 
	var serverUrl = "http://121.43.57.75:3000/users";
	var page = 1;
	var app = {
		init:function(){
			var index = 1;
			setInterval(function(){
				 $(".banner-lists").hide();
				 $(".banner-lists").eq(index).fadeIn();
				 if(index == $(".banner-lists").length-1){
				 	index = 0;
				 }else{
				 	index ++;
				 }
			},3000);

			//公告
			$(".notice-list").click(function(){
				var id = $(this).attr("data-id");
				window.location.href="/pc/noticeDetail?id="+id;
			});	

			//专题
			$(".special-images-container").click(function(){
				var id = $(this).attr("data-id");
				window.location.href="/pc/specialShop?dataId="+id;
			});

			$(".class-lists").click(function(){
				var name = $(this).text();
				name = encodeURIComponent(name);
				var url = "/pc/classDetail?className="+name;
				window.location.href=url;
			});
			$(".headers").eq(0).addClass("select");

			//上一页
			$(".prev").click(function(){
				if(page != 1){
					page --;
					app.getNoticeDataByPage(page,function(flag){
						console.log(page);
					});
				}
			});

			//下一页
			$(".next").click(function(){
				page ++;
				app.getNoticeDataByPage(page,function(flag){
					if(flag == 0){
						page --;
					}
				});
			});
		},
		getNoticeDataByPage:function(page,callback){
			$.ajax({
				url:serverUrl+"/getNoticeByPage?page="+page,
				type:"get",
				dataType:"json",
				json:"callback",
				success:function(data){
					if(data.code == 200){
						if(data.data.length>0){
							$(".notice-list").remove();
							var datas = data.data;
							for(var i=0;i<datas.length;i++){
								var value = datas[i];
								var subdiv = "<div class='notice-list' data-id="+value._id+">"
											+"	<div class='notice-content'>"+value.noticeName+"</div>"
											+"  <div class='notice-time'>"+app.get_time(value.notice_id)+"</div>"
											+"	<div class='mores'>"
											+"		<img src='/images/gonggao.png'/>"
											+"	</div>"
											+"</div>";
								$(".notice-container").append(subdiv);
							}
							//公告
							$(".notice-list").click(function(){
								var id = $(this).attr("data-id");
								window.location.href="/pc/noticeDetail?id="+id;
							});
							callback(1);
						}else{
							alert("已经是最后一页啦");
							callback(0);
						}
					}
				},
				error:function(err){

				}
			});
		},
		get_time:function(this_time){
			Date.prototype.format = function(format) {
				var date = {
					   "M+": this.getMonth() + 1,
					   "d+": this.getDate(),
					   "h+": this.getHours(),
					   "m+": this.getMinutes(),
					   "s+": this.getSeconds(),
					   "q+": Math.floor((this.getMonth() + 3) / 3),
					   "S+": this.getMilliseconds()
				};
				if (/(y+)/i.test(format)) {
					   format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
				}
				for (var k in date) {
					   if (new RegExp("(" + k + ")").test(format)) {
							  format = format.replace(RegExp.$1, RegExp.$1.length == 1
									 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
					   }
				}
				return format;
			}
			var cc=new Date(parseInt(this_time));
			var aa=cc.format('yyyy-MM-dd h:m:s');
			return aa;
		}
	}

	app.init();
}