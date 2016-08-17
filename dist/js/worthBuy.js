define(function(require,exports,module){
	require("common.js");
	require("jquery-1.10.1.min.js");
	require("zepto.min.js");
//	require("zepto-tap.js");
	require("swiper-3.3.1.min.js");
	var p={
		_init:function(){
			p.swiper();
		},
		swiper:function(){
			var myswiper=new Swiper("#l-swiper1",{
				slidesPerView : 5,
			});
		}
	}
	module.exports={
		init:p._init,
	}
})
