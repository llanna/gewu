
require('./zepto.min');
require('./zepto-tap');
var thisScroll = require('./iscroll');
// 把iscroll插件 依赖给 thisScroll  所以所thisScroll 有 iScroll() 这个方法

var myScroll,
	pullDownEl, pullDownOffset,_maxScrollY,
	pullUpEl, pullUpOffset,num=1,
	generatedCount = 0;

function getGoodsData(classID,pageCode,linenumber,slide,flag){
	var thisClassID = classID?classID:0;
	var thisPageCode = pageCode?pageCode:0;
	var thisSlide = slide?slide:0;
	var thisLineNumber = linenumber?linenumber:6;
	var params = {
		classID:thisClassID,
		pageCode:thisPageCode,
		linenumber:thisLineNumber
	}
	$.ajax({
		url:'http://datainfo.duapp.com/shopdata/getGoods.php',
		type:'get',
		data:params,
		dataType:'jsonp',
		success:function(data){
			console.log(data.length);
			if(data.length){
				$.each(data,function(i){
					var oldPrice = parseInt(data[i].price*data[i].discount*0.1);
					var oLi = $("<li><dl><dt><img src="+data[i].goodsListImg+"></dt><dd><h3>"+data[i].goodsName+"</h3><div><b class='price'>￥"+oldPrice+"</b><span class='oldprice'>￥"+data[i].price+"</span></div><span class='discount'>"+data[i].discount+"折</span><a href='#'></a></dd></dl></li>");
					if(flag){
						$('#thelist').append(oLi);
					}else{
						$('#thelist').prepend(oLi);
					}
					
				});
			}
			myScroll.refresh();
		}
	})
}

function pullDownAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		
		//刷新myscroll
		getGoodsData(0,0,3,0,false);
		// myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}


function pullUpAction () {
	setTimeout(function () {
		// <-- Simulate network congestion, remove setTimeout from production!
		getGoodsData(0,0,3,0,true);
		
			// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = pullUpEl.offsetHeight; 

	//初始化scroll  
	myScroll = new thisScroll.iScroll('wrapper', {
		useTransition: true,       //是否使用css 变形
		topOffset: pullDownOffset,   //已经滚动的基准值
		hideScrollbar:true,          //表示用户没有操作scroll时会隐藏滚动条
		fadeScrollbar:false,
		lockDirection:true,
		//表示滚动条重新 刷新 
		onRefresh: function () {
            _maxScrollY = this.maxScrollY = this.maxScrollY + pullUpOffset;
            //match
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多...';
			}
		},
		//表示滚动条开始滑动
		onScrollMove: function () {
			// y:滚动条距离垂直初始位置 (负值)
			if (this.y > 5 && !pullDownEl.className.match('flip')) {

				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开刷新...';  //松开刷新
				this.minScrollY = 0;
				
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				this.minScrollY = -pullDownOffset;
				
			} else if (this.y <= (_maxScrollY - pullUpOffset) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开加载...';
                this.maxScrollY = this.maxScrollY - pullUpOffset;
			}
			 else if (this.y > (_maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多...';
                this.maxScrollY = this.maxScrollY + pullUpOffset;
			}
		},
		//表示滚动条滑动结束时候
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});

setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

//处理浏览器默认事件
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//当 DOM 元素 已经加载好内容后执行
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
