window.onload = function(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var body = document.getElementsByTagName("body")[0];
	var loading = document.getElementById("loading");
	var game = document.getElementById("wrap");
	var getScore = document.getElementById("score");
	var again = document.getElementById("again");
	var keep = document.getElementById("continue");
	var hold = document.getElementById("hold");
	var restart = document.getElementById("restart");
	var start = document.getElementById("start");
	var startGame = document.getElementById("startGame");
	var bgMusic = document.getElementById("bgMusic");
	var bulletMusic = document.getElementById("bulletMusic");
	var emyOne = document.getElementById("emyOne");
	var emyTwo = document.getElementById("emyTwo");
	var emyThree = document.getElementById("emyThree");
	var overMusic = document.getElementById("overMusic");
    
	goPAGE();//判断移动端 or PC端
	
	var bgImg = {
		//背景图
		y:0,
		draw:function (){
			context.drawImage(loadOver[0],0,this.y,canvas.width,canvas.height);
			context.drawImage(loadOver[0],0,this.y-canvas.height,canvas.width,canvas.height);
		},
		move:function (){
			this.y++;
			if (this.y>=canvas.height){
				this.y = 0;
			}
		}
	}
	
	var myPlane = {
		w:66,
		h:82,
		x:0,
		y:0,
		drawX:canvas.width/2-33,
		drawY:canvas.height-82,
		survival:true,
		draw:function(){
			context.drawImage(loadOver[7],this.x,this.y,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
		},
		boomNum:0,
		length:25,
		score:0,
		suicide:function(){
			this.boomNum++;
			if (this.boomNum%5==0){
				this.x+=this.w;
			}
			if(this.boomNum>this.length-1){
				
				this.w = 0;
				this.h = 0;
				animateBol = false;
				sendAjax();
			}
		}
	}
	var myPlaneCollideTop = {
		w:18,
		h:30,
		drawX:myPlane.drawX+myPlane.w/2-8,
		drawY:myPlane.drawY,
		draw:function(){
			context.beginPath();
			context.fillStyle = "transparent";
			context.fillRect(this.drawX,this.drawY,this.w,this.h);
		}
	}
	var myPlaneCollideBottom = {
		w:60,
		h:32,
		drawX:myPlane.drawX+3,
		drawY:myPlane.drawY+myPlaneCollideTop.h,
		draw:function(){
			context.beginPath();
			context.fillStyle = "transparent";
			context.fillRect(this.drawX,this.drawY,this.w,this.h);
		}
	}
	
	
	
	
	var removeBol = false;
	function Bullet(){
		//子弹
		this.x = 0;
		this.y = 0;
		this.w = 6;
		this.h = 14;
		this.speed = 10;
		this.drawX = myPlane.drawX+myPlane.w/2-this.w/2+1;
		this.drawY = myPlane.drawY;
		
	}
	Bullet.prototype.draw = function(){
		context.drawImage(loadOver[2],this.x,this.y,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
	}
	Bullet.prototype.drawTwo = function(){
		context.drawImage(loadOver[3],this.x,this.y,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
	}

	Bullet.prototype.move = function(){
		this.drawY -= this.speed;
	}
	Bullet.prototype.clear = function(){
		if(this.drawY<=(-this.h)){
			for (var i=0; i<bullets.length; i++){
				if (this == bullets[i]){
					bullets.splice(i,1);
					return true;
				}
			}
		}
	}
	
	var emys = [];
	var hitEmys = [];
	var reBol = false;

	function Emy(enemy){
		this.w = enemy.w;
		this.h = enemy.h;
		this.length = enemy.length*5;
		this.cutX = 0;
		this.cutY =0;
		this.drawX = randFn(0,canvas.width-enemy.w);
		this.drawY =  -enemy.h;
		this.bombNum = 0;
		this.hit = 0;
		this.speed = randFn(2,4);
		this.holdspeed = this.speed;
		this.scoreBol = true;
		this.draw = function (){
			context.drawImage(enemy,this.cutX,this.cutY,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
		};
		this.bomb = function (){
			if(this.scoreBol){
				if(this.w == loadOver[4].width/5){
					scoreNum += 10;
				}else if(this.w == loadOver[6].width/6){
					scoreNum += 20;
				}else if(this.w == loadOver[5].width/10){
					scoreNum += 50;
				}
				this.scoreBol = false;
			}
			
			this.bombNum++;
			if (this.bombNum%5==0){
				this.cutX+=this.w;
			}
			
			if (this.bombNum>=this.length-1){
				//动画完成后执行删除对象
				for (var i=0; i<hitEmys.length; i++){
					if (this==hitEmys[i]){
						hitEmys.splice(i,1);
						return true;
					}
				}
			}
		};

		this.move = function (){
			this.drawY+=this.speed;
		}
		this.clear = function(){
			if (this.drawY>=canvas.height){
				for (var i=0; i<emys.length; i++){
					if (this == emys[i]){
						emys.splice(i,1);
						reBol = true;
						break;
					}
				}
			}
		}
	}
	function createEmy(){
		var emyR = randFn(1,100);
		if (emyR>=0&&emyR<=75){
			var emyImg = loadOver[4];
			emyImg.w = emyImg.width/5;
			emyImg.h = emyImg.height;
			emyImg.length = 5;
		}else if (emyR>75&&emyR<=85){
			var emyImg = loadOver[5];
			emyImg.length=10;
			emyImg.w = emyImg.width/10;
			emyImg.h = emyImg.height;
		}else{
			var emyImg = loadOver[6];
			emyImg.length=6;
			emyImg.w = emyImg.width/6;
			emyImg.h = emyImg.height;
		}
		var emyObj = new Emy(emyImg);
		emys.push(emyObj);
	}
	
	
	
	function randFn(min,max){
		return parseInt(Math.random()*(max-min)+min);
	}

	function goPAGE() {
		//判断用户是用的移动端还是PC端
		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			//手机浏览器
			canvas.width = body.offsetWidth;
			canvas.height = body.offsetHeight;
			var rangeX = -1;
			var rangeY = -1;
			canvas.addEventListener("touchstart",function (){
				var first = event.touches[0];
				if(first.clientX>=myPlane.drawX&&first.clientX<=myPlane.drawX+myPlane.w&&first.clientY>=myPlane.drawY&&first.clientY<=myPlane.drawY+myPlane.h){
					rangeX = first.clientX - myPlane.drawX;
					rangeY = first.clientY - myPlane.drawY;
				}else{
					rangeX = -1;
					rangeY = -1;
				}
				if(boomNum>0){
					if(first.clientX>=boom.drawX&&first.clientX<=boom.drawX+boom.w&&first.clientY>=boom.drawY&&first.clientY<=boom.drawY+boom.h){
						for(var i=0; i<emys.length; i++){
							hitEmys.push(emys[i]);
							emys.shift();
							i--;
						}
						boomNum--;
					}
				}
				if(first.clientX>=canvas.width-loadOver[9].width-10&&first.clientX<=canvas.width-10&&first.clientY>=10&&first.clientY<=10+loadOver[9].height){
		
					animateBol = false;
					hold.style.display = "block";
				}
				event.preventDefault();
			},false);
			canvas.addEventListener("touchmove",function (){
				var movePlane = event.touches[0];
				if(rangeX>=0){
					myPlane.drawX = movePlane.clientX - rangeX;
					myPlane.drawY = movePlane.clientY - rangeY;
				}
				
				
				event.preventDefault();
			},false);
		}
		else {
	   		//桌面端
	   		body.style.width = 320 + "px";
	   		body.style.height = 568 + "px";
		    loading.style.width = 320 + "px";
		    loading.style.height = 568 + "px";
	        canvas.width = 320;
	        canvas.height = 568;
	        
	        canvas.onmousedown = function(ev){
	        		var rangeX = ev.clientX - myPlane.drawX;
				var rangeY = ev.clientY - myPlane.drawY;
				if(boomNum>0){
					if(ev.clientX>=boom.drawX&&ev.clientX<=boom.drawX+boom.w&&ev.clientY>=boom.drawY&&ev.clientY<=boom.drawY+boom.h){
						for(var i=0; i<emys.length; i++){
							hitEmys.push(emys[i]);
							emys.shift();
							i--;
						}
						boomNum--;
					}
				}
				canvas.onmousemove = function(ev){
					if(ev.clientX>=myPlane.drawX&&ev.clientX<=myPlane.drawX+myPlane.w&&ev.clientY>=myPlane.drawY&&ev.clientY<=myPlane.drawY+myPlane.h){
						myPlane.drawX = ev.clientX - rangeX;
						myPlane.drawY = ev.clientY - rangeY;
					}
				}
	        }
	        canvas.onmouseup = function(){
	        		canvas.onmousemove = null;
	        }
	    }
	}
	
	function loadImg(arr,fn){
		//加载图片
		var arr1 = [];
	   	var index = 0;
	   	var arr2 = [];
	   	for(var i=0; i<arr.length; i++){
	   		var imgObj = new Image();
	   		imgObj.src = arr[i];
	   		imgObj.index = i;
	   		imgObj.onload = function(){
	   			index++;
	   			arr1.push(this);
	
	   			if(index>arr.length-1){
	   				for(var i=0; i<arr1.length;i++){
	   					for(var j=0; j<arr1.length; j++){
	   						if(arr1[j].index == i){
	   							
	   							arr2.push(arr1[j]);
	   						}
	   					}
	   				}
	   				if(fn){
	   					fn();
	   				}
	   			}
	   		}
	   		
	   	}
	   	return arr2;
	}
	

	var myPlaneNum = 0;
	
	function jet(){
		//myPlane尾部喷气
		myPlaneNum++;
		if(myPlaneNum%10 == 0){
			if(myPlane.x == 0){
				myPlane.x = 66;
			}else{
				myPlane.x = 0;
			}
		}
		if(myPlaneNum == 20){
			myPlaneNum = 0;
		}
	}
	
	var bullets = [];
	var frameNum = 0;
	var createBulletSpeed = 10;
	var createBulletBol = true;
	
	function createBullet(){
		//创建子弹
		if(createBulletSpeed == 5){
			quicken();
		}
		if(frameNum%createBulletSpeed == 0){
			var bullet = new Bullet();
			bullets.push(bullet);
		}
		
	}

	var bugNum = 0;
	function createBulletTwo(){
		bugNum++;
		if(frameNum%createBulletSpeed == 0){
			var bulletLeft = new Bullet();
			bulletLeft.w = 7;
			bulletLeft.drawX = myPlane.drawX+9;
			bulletLeft.drawY = myPlane.drawY+10;
			var bulletRight = new Bullet();
			bulletRight.w = 7;
			bulletRight.drawX =  myPlane.drawX+myPlane.w-bulletRight.w-7;
			bulletRight.drawY = myPlane.drawY+10;
			bullets.push(bulletLeft);
			bullets.push(bulletRight);
		}
		if (bugNum == 1000) {
			createBulletBol = true;
			bugNum = 0;
		}
	}
	var bugNum2 = 0;
	function quicken(){
		bugNum2++;
		if(bugNum2 == 1000){
			bugNum2 = 0;
			createBulletSpeed = 10;
		}
	}
	function createEnemys(){
		//创建敌机
		if(frameNum%25 == 0){
			createEmy();
		}	
	}
	function score(){
		context.beginPath();
		context.fillStyle = "black";
		context.font = "30px STKaiti";
		context.fillText("score: "+scoreNum,10,30);
		context.fillText("x ["+boomNum+"]",boom.drawX+boom.w+10,boom.drawY+23);
		context.beginPath();
		context.font = "14px STKaiti";
		context.fillText("By H_MZ",canvas.width-70,canvas.height-15);
	}
	
	var boom = {
		x:0,
		y:0,
		w:42,
		h:36,
		drawX:10,
		drawY:canvas.height-36-10,
		draw:function(){
			context.drawImage(loadOver[1],this.x,this.y,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
		}
	}
	
	var scoreNum = 0;
	var boomNum = 0;
	
	function Stage(){
		//道具对象
		this.x = randFn(0,3)*39;
		this.y = 0;
		this.w = 39;
		this.h = 68;
		this.drawX = randFn(0,canvas.width-this.w);
		this.drawY = -this.h;
		this.speedX = randFn(-3,3);
		this.speedY = randFn(2,3);
	}
	Stage.prototype.move = function(){
		this.drawX += this.speedX;
		if(this.drawX<=0){
			this.speedX *= -1;
		}else if(this.drawX>=canvas.width-this.w){
			this.speedX *= -1;
		}
		this.drawY += this.speedY;
	}
	Stage.prototype.draw = function(){
		context.drawImage(loadOver[8],this.x,this.y,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
	}
	var stageBol = false;
	Stage.prototype.clear = function(){
		if(this.drawY>=canvas.height){
			for (var i=0; i<stages.length; i++){
				if (this == stages[i]){
					stages.splice(i,1);
					break;
				}
			}
		}
	}
	var stages = [];
	function createStage(){
		if(frameNum%1600 == 0){
			var stage = new Stage();
			stages.push(stage);
		}	
	}
	
	function collide(obj1,obj2){
	//碰撞检测
		var l1 = obj1.drawX;
		var r1 = l1+obj1.w;
		var t1 = obj1.drawY;
		var b1 = t1+obj1.h;
		
		var l2 = obj2.drawX;
		var r2 = l2+obj2.w;
		var t2 = obj2.drawY;
		var b2 = t2+obj2.h;
		
		if (r1>l2&&l1<r2&&b1>t2&&t1<b2){
			return true;
		}else{
			return false;
		}
	}
	
	function myPlaneCollide(){
		if(stages.length>0){
			var collideTopBol = collide(myPlaneCollideTop,stages[0]);
			var collideBottomBol = collide(myPlaneCollideBottom,stages[0]);
			if(collideTopBol||collideBottomBol){
				
				if(stages[0].x == 0){
					boomNum++;	
				}else if(stages[0].x == stages[0].w){
					createBulletBol = false;
					bugNum = 0;
				}else if(stages[0].x == stages[0].w*2){
					createBulletSpeed = 5;
					bugNum2 = 0;
				}
				stages.shift();
			}
		}
		for(var i=0; i<emys.length; i++){
			
			var commitTop = collide(myPlaneCollideTop,emys[i]);
			var commitBottom = collide(myPlaneCollideBottom,emys[i]);
			if(commitTop||commitBottom){
				gameOver();
			}
		}
		
	}
	
	function gameOver(){
		bullets = [];
		myPlane.survival = false;
		for(var i=0; i<emys.length; i++){
			emys[i].speed = 0;
		}
		createBulletBol = undefined;
		game.style.display = "block";
		getScore.innerHTML = scoreNum;
	}
	
	var animateBol = false;
	
	function myPlaneCollideReplace(){
		myPlaneCollideTop.drawX = myPlane.drawX+myPlane.w/2-8;
		myPlaneCollideTop.drawY = myPlane.drawY;
		myPlaneCollideTop.draw();
		myPlaneCollideBottom.drawX = myPlane.drawX+3;
		myPlaneCollideBottom.drawY = myPlane.drawY+myPlaneCollideTop.h;
		myPlaneCollideBottom.draw();
	}
	
	function suspend(){
		//暂停
		context.drawImage(loadOver[9],canvas.width-loadOver[9].width-10,10);
	}
	
	function animate(){
		frameNum++;
		if(myPlane.survival){
			jet();//myPlane尾部喷气
		}else{
			myPlane.suicide();
		}
		context.clearRect(0,0,canvas.width,canvas.height);//清屏
		
		bgImg.move();//背景动
		bgImg.draw();//背景绘制
		
		myPlane.draw();//飞机绘制
		myPlaneCollideReplace();
		
		if(createBulletBol == true){
			createBullet();//创建子弹
		}else if(createBulletBol == false){
			createBulletTwo();
		}
		
		for(var i=0; i<bullets.length;i++){
			bullets[i].move();
			if(createBulletBol == true){
				bullets[i].draw();
			}else if(createBulletBol == false){
				bullets[i].drawTwo();
			}
			var bol = bullets[i].clear();
			//碰撞检测
			if(!bol){
				var bx = bullets[i].drawX;
				var bt = bullets[i].drawY;
				for(var j=0; j<emys.length; j++){
					var ex = emys[j].drawX;
					var exo = emys[j].drawX+emys[j].w;
					var et = emys[j].drawY;
					var eto = emys[j].drawY+emys[j].h;
					if(bx>=ex&&bx<=exo&&bt>=et&&bt<=eto){
						bullets.splice(i,1);
						removeBol = true;
						if(emys[j].w == loadOver[4].width/5){
							emys[j].speed = 0;
							hitEmys.push(emys[j]);
							emys.splice(j,1);
							
							break;
						}else if(emys[j].w == loadOver[6].width/6){
							emys[j].hit++;
							if(emys[j].hit == 3){
								emys[j].speed = 0;
								hitEmys.push(emys[j]);
								emys.splice(j,1);
								
								break;
							}
						}else if(emys[j].w == loadOver[5].width/10){
							emys[j].hit++;
							if(emys[j].hit == 8){
								emys[j].speed = 0;
								hitEmys.push(emys[j]);
								emys.splice(j,1);
							
								break;
							}
						}
					}
				}
			}
			
			if(bol||removeBol){
				i--;
				removeBol = false;
			}
		}
		createEnemys();//创建敌机
		for (var i=0; i<emys.length; i++){
			emys[i].move();
			emys[i].draw();
			emys[i].clear();
			if (reBol){
				i--;
				reBol = false;
			}
			
		}//清除多余敌机
		for(var i=0; i<hitEmys.length; i++){
			var hitBol = hitEmys[i].bomb();
		
			if (hitBol){
				i--;
			}else{
				hitEmys[i].draw();
			}
		}//爆炸敌机动画
		createStage();//创建道具
		for(var i=0; i<stages.length; i++){
			stages[i].move();
			stages[i].draw();
			stages[i].clear();
		}
		
		//飞机碰撞
		myPlaneCollide();
		score();//得分数
		boom.draw();//左下角炸弹数
		suspend();//暂停
		if(frameNum == 1600){
			frameNum = 0;
		}
		if(animateBol){
			var animateId = window.requestAnimationFrame(animate);
		}
		
	}
				
	function startAgain(){
		animateBol = true;
		myPlane.w = 66;
		myPlane.h = 82;
		myPlane.drawX = canvas.width/2-33,
		myPlane.drawY = canvas.height-82,
		myPlane.survival = true;
		myPlane.boomNum = 0;
		frameNum = 0;
		scoreNum = 0;
		boomNum = 0;
		myPlaneNum = 0;//喷气
		bugNum = 0;
		bugNum2 = 0;
		createBulletSpeed = 10;
		createBulletBol = true;
		emys = [];
		hitEmys = [];
		stages = [];
		animate();
		bullets = [];
	}
	
	var imgArr = ["img/background.png","img/bomb.png","img/bullet1.png","img/bullet2.png","img/enemy1.png","img/enemy2.png","img/enemy3.png","img/herofly.png","img/prop.png","img/Fav_Voice_Pause.png","img/Fav_Voice_Play.png"];
	var loadOver = [];
	var bgTimer = null;

			
	
	loadOver = loadImg(imgArr,function(){
		loading.style.display = "none";
		canvas.style.display = "block";
		startGame.style.display = "block";
		startGame.onclick = function(){
			start.style.display = "none";
			animateBol = true;
			animate();
		}
		again.onclick = function(){
			game.style.display = "none";
			startAgain();
		}
		keep.onclick = function(){
			animateBol = true;
			animate();
			hold.style.display = "none";
		}
		restart.onclick = function(){
			startAgain();
			hold.style.display = "none";
		}
        
        
        var close = $("#close");
        var bill = $("#bill");
        var over = $(".over");
        
        close.on("click",function(){
            $(".player").empty();
            bill.hide();
        })
        over.on("click",function(){
            $.ajax({
                type:"get",
                url:"ranking.php",
                dataType:"json",
                success:function(arr){
                    var len = arr.length;
                    for(var i=0; i<len; i++){
                        var num = i+1;
                        var li = $('<li><i>'+num+'</i><img src="'+arr[i].src+'"/><span>'+arr[i].name+'</span><em>'+arr[i].score+'</em></li>');
                        $(".player").append(li);
                    }
                	bill.show();
                }
            });
            
        })
		
	});
	
	function sendAjax(){
        var name = $(".user").html();
        var src = $(".imgUrl").html();
        var openid = $(".openid").html();
		
		$.ajax({
			type:"get",
			url:"userName.php",
			data:{
				user:name,
				imgSrc:src,
                openid:openid,
				score:scoreNum
			}
		});
	}
}










