/**
 * 定义工具类
 * 包含dom查找，css样式，动画等
 */
define(function (window,document) {
	
	//判断是否支持css属性
	var supports = (function() {
		var div = document.createElement('div'),
			vendors = 'Khtml,Ms,O,Moz,Webkit'.split(' '),
			len = vendors.length;
		
		return function(prop) {
			if ( prop in div.style ){
				return true;
			}

			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
	
			for(var i = 0; i<len; i++){
				if ( vendors[len] + prop in div.style ) {
					break 
					return true;
				}
			}
			return false;
		};
	})();
	
	
	var private_css3 = (supports('-webkit-transition') && supports('-webkit-transform')) ? true : false;
	
    var Tween = {
		Linear: function (t, b, c, d) { return c * t / d + b; },
		QuadEaseIn: function (t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		SineEaseIn: function (t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		SineEaseOut: function (t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		ElasticEaseOut: function (t, b, c, d, a, p) {
			if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
			if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
			else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
		},
		BackEaseOut: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}
    }
	
	/**
	 * 判断对象类型
	 * String Number Array
	 * Object Function 
	 * HTMLDocument
	 * Undefined Null 
	 */
	function TypeOf(obj) {
		return Object.prototype.toString.call(obj).match(/\s(\w+)/)[1];
	}
	/**
 	 * 遍历数组或对象
	 * 
	 */
	function each(arr,fn){
		//检测输入的值
		if(typeof(arr) == 'object' && typeof(fn) == 'function'){
			if(typeof(arr.length) != undefined){
				for(var i=0,total=arr.length;i<total;i++){
					fn.call(this,i,arr[i]);
				}
			}else{
				for(var i in arr){
					fn.call(this,i,arr[i]);
				}
			}
		}
	}
	/**
	 * 判断dom是否拥有某个class
	 */
	function hasClass(dom,classSingle){
		var classStr = dom.className;
		//dom有class 检测，无class，直接返回false
		if(classStr && classStr.length){
			return dom.className.match(new RegExp('(\\s|^)' + classSingle +'(\\s|$)'));
		}else{
			return false;
		}
	}
	//获取样式
	function getStyle(elem, prop) {
		var value;
		prop == "borderWidth" ? prop = "borderLeftWidth" : prop;
		if (elem.style[prop]){
			value = elem.style[prop];
		} else if(document.defaultView) {
			var style = document.defaultView.getComputedStyle(elem, null);
			value = prop in style ? style[prop] : style.getPropertyValue(prop);
		} else if (elem.currentStyle) {
			value = elem.currentStyle[prop];
		}
		
		
		if (/\px$/.test(value)){
			value = parseInt(value);
		} else if( value == +value){
			value = value = parseInt(value*10000)/10000;;
		} else if(value == '' || value == 'medium'){
			value = 0;
		} else if (value == 'auto'){
			if(prop == 'height'){
				value = elem.clientHeight;
			}
		}
		
		return value;
	}
	

	/**
	 * dom设置样式
	 */
	function setStyle(elem,prop,value){
	
		if(typeof(value) != 'string' && (value != +value)){
			//console.log(prop,'-',value,'-','error');
			return
		}
		prop = prop.toString();
		if (prop == "opacity") {
			elem.style['filter'] = 'alpha(opacity=' + (value * 100)+ ')';
			value = value;
		} else if (value == +value && value != ''){
			value = value + "px";
		}
		//console.log(prop,value)
		elem.style[prop] = value;
	}
	//设置css
	function setCss(dom,cssObj){
		for (var pro in cssObj) {
			if (!cssObj.hasOwnProperty(pro)){
				continue;
			}
			setStyle(dom,pro,cssObj[pro]);
		}
	}
	
	/**
	 * 获取动画所需的参数，只获取为数字的参数
	 *
	 * 属性名
	 * 初始值
	 * 目标值
	 */
	function parseCSS_forAnim (elem, cssObj) {
		var props = [];
		var cssOri = [];
		var cssEnd = [];
		for (var prop in cssObj) {
			if (!cssObj.hasOwnProperty(prop)){
				continue;
			}
			
			var value = getStyle(elem, prop);
			//格式化css属性值
			if (/\px$/.test(value)){
				value = parseInt(value);
			}
			
			if(value !== '' && (value == +value)){
				value = parseInt(value*10000)/10000;
				props.push(prop);
				cssOri.push(value);
				cssEnd.push(cssObj[prop]);
			}
			
		}
		return [props,cssOri,cssEnd];
	}
	
	//给定计算方式，当前帧的CSS值
	function countNewCSS(start,end,use_time,all_time,fn){
		start = start * 10000;
		end = end * 10000;
		
		return  fn(use_time, start, (end-start), all_time)/10000;
	}
	var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 10);
				};
    })();
	
	/**
	 * 动画类
	 *
	 */
    function anim(elem,cssObj,durtime) {
		var args = arguments;
        this.elem = elem;
		
		var cssParse = parseCSS_forAnim(this.elem, cssObj);
		
		//需要修改的属性Array
		this.props = cssParse[0];
		//属性初始值Array
		this.cssOri = cssParse[1];
		//属性目标值Array
		this.cssEnd = cssParse[2];
		this.durtime = durtime;
		this.animType = "Linear";
		this.onEnd = null;
		if (args.length < 3) {
			throw new Error("missing arguments [dom,cssObj,durtime]");
		} else {
			if (TypeOf(args[3]) == "Function") {
				this.onEnd = args[3];
			}else if (typeof (args[3]) == "string") {
				this.animType = args[3];
			}
			
			if (TypeOf(args[4]) == "Function") {
				this.onEnd = args[4];
			}
		}
		this.startAnim();
    }
    anim.prototype['startAnim'] = function () {
		var me = this;
		//全部时间 | 开始时间
		var time_all = this.durtime;
		var time_start = new Date();
		
		//运动曲线方程
		var aniFunction = Tween[me.animType];
		
		//是否已结束动画
		var is_end = false;
		
		//需要修改的css条数
		var css_length = this.props.length;
		
		//显示当前帧（递归）
		function showFrame(){
			var time_use = new Date() - time_start;
			
			if (time_use < time_all) {
				requestAnimationFrame(showFrame);
			}else{
				time_use = time_all;
				is_end = true;
			}
			
			for (var i = 0; i < css_length; i++) {
				//计算当前帧需要的属性值
				var value = countNewCSS(me.cssOri[i],me.cssEnd[i],time_use,time_all,aniFunction);
				setStyle(me.elem,me.props[i],value);
			}
			
			if(is_end){
				me.onEnd && me.onEnd.call(me, me.elem);
			}
		}
		//开始动画
		requestAnimationFrame(showFrame);
	};
	
	
	var outerWidth,
		outerHeight;
	var testDom = document.createElement('div');
	//用生命在计算宽度
	function count_outerWidth (elem){
		return (getStyle(elem,'borderLeftWidth') + getStyle(elem,'paddingLeft') + getStyle(elem,'width') + getStyle(elem,'paddingRight') + getStyle(elem,'borderRightWidth'));
	}
	//用生命在计算高度
	function count_outerHeight (elem){
		return (getStyle(elem,'borderTopWidth') + getStyle(elem,'paddingTop') + getStyle(elem,'height') + getStyle(elem,'paddingBottom') + getStyle(elem,'borderBottomWidth'));
	}
	if(testDom.getBoundingClientRect !== 'undefined'){
		outerWidth = function(elem){
			var output = elem.getBoundingClientRect()['width'] || 0;
			
			return typeof(output) != 'undefined' ? output : count_outerWidth(elem);
		};
		outerHeight = function(elem){
			var output = elem.getBoundingClientRect()['height'] || 0;
			
			return typeof(output) != 'undefined' ? output : count_outerHeight(elem);
		};
	}else{
		outerWidth = count_outerWidth;
		outerHeight = count_outerHeight;
	}
	
	
	//缩小，淡出
	var zoomOut = private_css3 ? function(DOM,time,fn){
		var op = getStyle(DOM,'opacity');
		var transt = getStyle(DOM,'-webkit-transition');
		
		setCss(DOM,{
			'-webkit-transform' : 'scale(0.5)',
			'-webkit-transition' : time + 'ms',
			'opacity' : 0,
		});
		
		var delay;
		DOM.addEventListener("webkitTransitionEnd", function(){
			clearTimeout(delay);
			delay = setTimeout(function(){
				setCss(DOM,{
					'-webkit-transform' : 'scale(1)',
					'-webkit-transition' : transt,
					'opacity' : op,
				});
				fn && fn.call(DOM);
			},20);
		}, true);
	} : function (DOM,time,fn){
		var op = getStyle(DOM,'opacity');
		DOM.style['overflow'] = 'hidden';
		var width = getStyle(DOM,'width');
		var height = outerHeight(DOM);
		var left = getStyle(DOM,'left') || 0;
		var top = getStyle(DOM,'top') || 0;
		
		new anim(DOM,{
			'width' : width/2,
			'height' : height/2,
			'left' : (left + width/4),
			'top' : (top + height/4),
			'opacity' : 0
		},time,function(){
			DOM.style['opacity'] = op;
			DOM.style['display'] = 'none';
			fn && fn.call(DOM);
		});
	};
	
	/**
	 * 页面加载
	 */
	var readyFns = [];
	function completed() {
		removeHandler(document,"DOMContentLoaded", completed);
		removeHandler(window,"load", completed);
		for(var i =0,total=readyFns.length;i<total;i++){
			readyFns[i]();
		}
		readyFns = null;
	}
	function ready(callback){
		if ( document.readyState === "complete" ) {
			callback && callback();
		} else {
			callback && readyFns.push(callback);
			
			bindHandler(document,'DOMContentLoaded',completed);
			bindHandler(window,'load',completed);
		}
	}
	
	/**
	 * 事件绑定
	 * elem:节点
	 * type:事件类型
	 * handler:回调
	 */
    var bindHandler = (function() {
		// 标准浏览器
		if (window.addEventListener) {
			return function(elem, type, handler) {
				// 最后一个参数为true:在捕获阶段调用事件处理程序
				//为false:在冒泡阶段调用事件处理程序
				elem.addEventListener(type, handler, false);
			}
		} else if (window.attachEvent) {
			// IE浏览器
			return function(elem, type, handler) {
				elem.attachEvent("on" + type, handler);
			}
		}
	})();

	/**
	 * 事件解除
	 * elem:节点
	 * type:事件类型
	 * handler:回调
	 */
	var removeHandler = (function() {
		// 标准浏览器
		if (window.removeEventListener) {
			return function(elem, type, handler) {
				elem.removeEventListener(type, handler, false);
			}
		} else if (window.detachEvent) {
			// IE浏览器
			return function(elem, type, handler) {
				elem.detachEvent("on" + type, handler);
			}
		}
	})();
	
	function checkEventForClass(event,classStr,dom){
		var target = event.srcElement || event.target;
		while (1) {
			if(target == dom){
				return false;
			}
			if(hasClass(target,classStr)){
				return target;
			}
			if(!target){
				return false;
			}
			target = target.parentNode;
		}
	}
	function bind(elem, type,a,b){
		var className,fn;
		if(typeof(a) == 'string'){
			className = a.replace(/^\./,'');
			fn = b;
			bindHandler(elem,type,function(e){
				var bingoDom = checkEventForClass(e,className,elem);
				if(bingoDom){
					fn && fn.call(bingoDom);
				}
			});
		}else{
			fn = a;
			bindHandler(elem,type,fn);
		}
	}
	//通用拖动方法
	function drag(handle_dom,dom,param){
		var param = param || {};
		var onStart = param['start'] || null;
		var onMove = param['move'] || null;
		var onEnd = param['end'] || null;
		
		var X, Y,L,T,W,H;
		bindHandler(handle_dom,'mousedown',function (e){
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			X = e.clientX;
			Y = e.clientY;
			L = getStyle(dom,'left');
			T = getStyle(dom,'top');
			W = outerWidth(dom);
			H = outerHeight(dom);
			onStart && onStart.call(dom,X,Y);
			bindHandler(document,'mousemove',move);
			bindHandler(document,'mouseup',up);
		});
		
		function move(e){
			onMove && onMove.call(dom,(e.clientX - X),(e.clientY - Y),L,T,W,H);
			//做了点儿猥琐的事情，你懂得
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
		}
		function up(e) {
			removeHandler(document,'mousemove',move);
			removeHandler(document,'mouseup',up);
			onEnd && onEnd.call(dom);
		}
	}
	
    return {
		'TypeOf' : TypeOf,
		'each' : each,
		'css' : setCss,
		'supports' : supports,
		'zoomOut' : zoomOut,
		'hasClass' : hasClass,
		'getStyle' : getStyle,
		'outerWidth' : outerWidth,
		'outerHeight' : outerHeight,
		'ready' : ready,
		'bind' : bind,
		'unbind' : removeHandler,
		'drag' : drag,
		//隐藏dom
		'hide' : function (elem){
			elem.style['display'] = 'none';
		},
		'animation' : function (a,b,c,d,e) {
			return new anim(a,b,c,d,e);
		},
		//创建dom
		'createDom' : function (html){
			var a = document.createElement('div');
			a.innerHTML = html;
			return a.childNodes;
		},
		//移除dom节点
		'removeNode' : function (elem){  
			if(elem && elem.parentNode && elem.tagName != 'BODY'){  
				elem.parentNode.removeChild(elem);  
			}  
		},
		//创建style标签
		'createStyleSheet' : function (cssStr,attr){
			var styleTag = document.createElement('style');
			
			attr = attr || {};
			attr.type = "text/css";
			for(var i in attr){
				styleTag.setAttribute(i, attr[i]);
			}
			
			// IE
			if (styleTag.styleSheet) {
				styleTag.styleSheet.cssText = cssStr;
			} else {
				var tt1 = document.createTextNode(cssStr);
				styleTag.appendChild(tt1);
			}
			
			return styleTag;
		},
		//根据class查找元素
		'findByClassName' : (function(){
			if(typeof(document.getElementsByClassName) !== 'undefined'){
				//支持gEbCN
				return function (dom,classStr){
					return dom.getElementsByClassName(classStr);
				};
			}else{
				//无奈采用遍历法
				return function (dom,classStr){
					var returns = [];
					//尝试获取所有元素
					var caches = dom.getElementsByTagName("*");
					//遍历结果
					each(caches,function(i,thisDom){
						//检查class是否合法
						if(hasClass(thisDom,classStr)){
							returns.push(thisDom);
						}
					});
					return returns;
				};
			}
		})(),
		 //读取dom在页面中的位置
		'offset' : function (elem){
			var box = {
				'top' : 0,
				'left' : 0,
				'screen_top' : 0,
				'screen_left' : 0
			}
			var size;
			
			if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
				size = elem.getBoundingClientRect();
			}
			box.screen_top = size.top;
			box.screen_left = size.left;
			box.top = size.top + document.body.scrollTop;
			box.left = size.left + document.body.scrollLeft;
			
			return box;
		},
		//滑出
		'slideUp' : function (DOM,time,fn){
			DOM.style['overflow'] = 'hidden';
			//FIXME padding
			new anim(DOM,{
				'height' : 0,
				'padding' : 0
			}, time,function(){
				DOM.style['display'] = 'none';
				fn && fn.call(DOM);
			});
		},
		//淡入
		'fadeIn' : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			DOM.style['opacity'] = 0;
			DOM.style['display'] = 'block';
			new anim(DOM,{
				'opacity' : op
			}, time, function(){
				fn && fn.call(DOM);
			});
		},
		//淡出
		'fadeOut' : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			new anim(DOM,{
				'opacity' : 0
			}, time,function(){
				DOM.style['opacity'] = op;
				DOM.style['display'] = 'none';
				fn && fn.call(DOM);
			});
		}
    }
});