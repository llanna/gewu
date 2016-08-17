//求出设备宽度
var w = document.documentElement.clientWidth;
var oHtml = document.getElementsByTagName("html")[0];
//通过设备宽度来改变对象的根节点字体大小
oHtml.style.fontSize = w/750*100 + "px";
//当屏幕窗口大小改变时的时候
window.onresize = function(){
	var w = document.documentElement.clientWidth;
	var oHtml = document.getElementsByTagName("html")[0];
	//通过设备宽度来改变对象的根节点字体大小
	oHtml.style.fontSize = w/750*100 + "px";
}

