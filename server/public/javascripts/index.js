window.onload = function(){ 
	var serverUrl = "http://121.43.57.75:3000/users";
	var page = 1;
	var app = {
		init:function(){
			var len = $(".oUlplay li").length;
			$(".oUlplay").width(len*1100);
			  var oDiv = document.getElementById('playBox');
			  var oPre = getByClass(oDiv,'pre')[0];
			  var oNext = getByClass(oDiv,'next')[0];
			  var oUlBig = getByClass(oDiv,'oUlplay')[0];
			  var aBigLi = oUlBig.getElementsByTagName('li');
			  var oDivSmall = getByClass(oDiv,'smalltitle')[0]
			  var aLiSmall = oDivSmall.getElementsByTagName('li');
			  function tab(){
	     for(var i=0; i<aLiSmall.length; i++)
	     {
		    aLiSmall[i].className = '';
	     }
	     aLiSmall[now].className = 'thistitle'
	     startMove(oUlBig,'left',-(now*aBigLi[0].offsetWidth))
	  }
	  var now = 0;
	  for(var i=0; i<aLiSmall.length; i++){
		  aLiSmall[i].index = i;
		  aLiSmall[i].onclick = function()
		  {
			  now = this.index;
			  tab();
		  }
	 }
	  oPre.onclick = function()
	  {
		  now--
		  if(now ==-1)
		  {
			  now = aBigLi.length;
		  }
		   tab();
	  }
	   oNext.onclick = function()
	  {
		   now++
		  if(now ==aBigLi.length)
		  {
			  now = 0;
		  }
		  tab();
	  }
	  var timer = setInterval(oNext.onclick,5000); //滚动间隔时间设置
	  oDiv.onmouseover = function()
	  {
		  clearInterval(timer);
	  }
	   oDiv.onmouseout = function()
	  {
		  timer = setInterval(oNext.onclick,5000); //滚动间隔时间设置
	  }
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
function getStyle(obj,name){
	if(obj.currentStyle)
	{
		return obj.currentStyle[name]
	}
	else
	{
		return getComputedStyle(obj,false)[name]
	}
}

function getByClass(oParent,nClass){
	var eLe = oParent.getElementsByTagName('*');
	var aRrent  = [];
	for(var i=0; i<eLe.length; i++)
	{
		if(eLe[i].className == nClass)
		{
			aRrent.push(eLe[i]);
		}
	}
	return aRrent;
}

function startMove(obj,att,add){
	clearInterval(obj.timer)
	obj.timer = setInterval(function(){
	   var cutt = 0 ;
	   if(att=='opacity')
	   {
		   cutt = Math.round(parseFloat(getStyle(obj,att)));
	   }
	   else
	   {
		   cutt = Math.round(parseInt(getStyle(obj,att)));
	   }
	   var speed = (add-cutt)/4;
	   speed = speed>0?Math.ceil(speed):Math.floor(speed);
	   if(cutt==add)
	   {
		   clearInterval(obj.timer)
	   }
	   else
	   {
		   if(att=='opacity')
		   {
			   obj.style.opacity = (cutt+speed)/100;
			   obj.style.filter = 'alpha(opacity:'+(cutt+speed)+')';
		   }
		   else
		   {
			   obj.style[att] = cutt+speed+'px';
		   }
	   }
	   
	},30)
}