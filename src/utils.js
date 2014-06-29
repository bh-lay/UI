/**
 * 定义工具类
 * 包含dom查找，css样式，动画等
 */
define(function () {
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
					// browser supports box-shadow. Do what you need.
					// Or use a bang (!) to test if the browser doesn't.
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
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function (t, b, c, d, a, p) {
                if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2){
					return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
				}else{
					return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
				}
            }
        }
    }

    var color = {
        sub: function (str, start, len) {
            if (len) return str.substring(start, start + len);
            else return str.substring(start);
        },
        hex: function (i) {  // 返回16进制颜色表示
            if (i < 0) return "00";
            else if (i > 255) return "ff";
            else { var str = "0" + i.toString(16); return str.substring(str.length - 2); }
        },
        //获取颜色数据    
        GetColors: function (sColor) {
            sColor = sColor.replace("#", "");
            var r, g, b;
            if (sColor.length > 3) {
                r = color.sub(sColor, 0, 2); g = color.sub(sColor, 2, 2); b = color.sub(sColor, 4, 2);
            } else {
                r = color.sub(sColor, 0, 1); g = color.sub(sColor, 1, 1); b = color.sub(sColor, 2, 1);
                r += r; g += g; b += b;
            }
            return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
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
	
		if(!value && (value != +value)){
			console.log(prop,'-',value,'-','error');
			return
		}
		prop = prop.toString();
		if (prop == "opacity") {
			elem.style['filter'] = 'alpha(opacity=' + (value * 100)+ ')';
			value = value;
		} else if (value == +value){
			value = value + "px";
		}
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
	
	//格式化css属性值
	function parseCSS_value(input){
		var output;
		if (input == "transparent") {
			output = [255, 255, 255,0];
		}else if (/^#/.test(input)) {
			output = color.GetColors(input);
		} else if (/^rgb/.test(input)) {
			//获得css值为rgba或rgb对应值（数组）
			output = input.match(/([0-9]+)/g);
		} else if (input == "opacity") {
			output = 100 * input;
		} else if (/\px$/.test(input)){
			output = parseInt(input);
		} else if( input == +input){
			output = value = parseInt(input*10000)/10000;;
		}
		return output;
	}
	
	/**
	 * 获取动画所需的参数
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
			value = parseCSS_value(value);
			
			if(value || (value == +value)){
				props.push(prop);
				cssOri.push(value);
				cssEnd.push(cssObj[prop]);
			}
			
		}
		return [props,cssOri,cssEnd];
	}
	
	//给定计算方式，当前帧的CSS值
	function countNewCSS(start,end,use_time,all_time,fn){
		var output
		if (TypeOf(start) == "Array" && TypeOf(end) == "Array") {
			//rgb初始值
			var r_s = start[0],
				g_s = start[1],
				b_s = start[2];
			//rgb变化差值
			var r_m = end[0] - r_s,
				g_m = end[1] - g_s,
				b_m = end[2] - b_s;
			//新的rgb值
			var r_n = Math.ceil(fn(use_time, r_s, r_m, all_time)),
				g_n = Math.ceil(fn(use_time, g_s, g_m, all_time)),
				b_n = Math.ceil(fn(use_time, b_s, b_m, all_time));
			
			if(start.length == 4 || end.length == 4){
				var a_s = start[3] || 100;
				var a_m = (end[3] || 100) - start[3];
				var a_n = fn(use_time, a_s, a_m, all_time);
				output = 'rgba(' + r_n + ',' + g_n + ',' + b_n + ',' + (a_n/100) + ')';
			}else{
				output = 'rgba(' + r_n + ',' + g_n + ',' + b_n + ')';
			}
		} else {
			start = start * 10000;
			end = end * 10000;
			output = fn(use_time, start, (end-start), all_time);
			output = output/10000;
		}
		
		return output
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
		this.animType = 'Tween.' + this.animType;
		this.startAnim();
    }
    anim.prototype['startAnim'] = function () {
		var me = this;
		//全部时间 | 开始时间
		var time_all = this.durtime;
		var time_start = new Date();
		
		//运动曲线方程
		var aniFunction = (eval(me.animType));
		
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
	
	
	
	//创建dom
	function createDom(html){
		var a = document.createElement('div');
		a.innerHTML = html;
		return a.childNodes;
	}
	//创建style标签
	function createStyleSheet(cssStr,attr){
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
	}
	
	//读取dom在页面中的位置
	function offset(elem){
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
		box.top = size.top + document.body.scrollTop;
		box.left = size.left + document.body.scrollLeft;
		
		return box;
	}
	function outerWidth (elem){
		var output;
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			var rect = elem.getBoundingClientRect()['width'] || 0;
			output = rect['width'];
			if(typeof(output) == 'undefined'){
				output = (getStyle(elem,'borderLeftWidth') + getStyle(elem,'paddingLeft') + getStyle(elem,'width') + getStyle(elem,'paddingRight') + getStyle(elem,'borderRightWidth'));
			}
		}else{
			output = (getStyle(elem,'borderLeftWidth') + getStyle(elem,'paddingLeft') + getStyle(elem,'width') + getStyle(elem,'paddingRight') + getStyle(elem,'borderRightWidth'));
		}
		return  output || 0;
	}
	function outerHeight (elem){
		var output;
		if ( typeof(elem.getBoundingClientRect) != 'undefined' ) {
			var rect = elem.getBoundingClientRect();
			output = rect['height'];
			if(typeof(output) == 'undefined'){
				output = (getStyle(elem,'borderTopWidth') + getStyle(elem,'paddingTop') + getStyle(elem,'height') + getStyle(elem,'paddingBottom') + getStyle(elem,'borderBottomWidth'));
			}
		}else{		
			output = (getStyle(elem,'borderTopWidth') + getStyle(elem,'paddingTop') + getStyle(elem,'height') + getStyle(elem,'paddingBottom') + getStyle(elem,'borderBottomWidth'));
		}
		return  output || 0;
	}
	
	//根据class查找元素
	var findByClassName = (function(){
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
	})();
	//移除dom节点
	function removeNode(elem){  
		if(elem && elem.parentNode && elem.tagName != 'BODY'){  
			elem.parentNode.removeChild(elem);  
		}  
	};
	
	//隐藏dom
	function hide(elem){
		elem.style['display'] = 'none';
	}
	//淡出
	function fadeOut(DOM,time,fn){
		var op = getStyle(DOM,'opacity');
		new anim(DOM,{
			'opacity' : 0
		}, time,function(){
			DOM.style['opacity'] = op;
			DOM.style['display'] = 'none';
			fn && fn.call(DOM);
		});
	}
	//淡入
	function fadeIn(DOM,time,fn){
		var op = getStyle(DOM,'opacity');
		DOM.style['opacity'] = 0;
		DOM.style['display'] = 'block';
		new anim(DOM,{
			'opacity' : op
		}, time, function(){
			fn && fn.call(DOM);
		});
	}
	//滑入
	function slideDown(DOM,time,fn){
		DOM.style['overflow'] = 'hidden';
		DOM.style['opacity'] = 0;
		DOM.style['display'] = 'block';
		//FIXME padding
		new anim(DOM,{
			'height' : 0
		}, time, function(){
			fn && fn.call(DOM);
		});
	}
	//滑出
	function slideUp(DOM,time,fn){
		DOM.style['overflow'] = 'hidden';
		//FIXME padding
		new anim(DOM,{
			'height' : 0,
			'padding' : 0
		}, time,function(){
			DOM.style['display'] = 'none';
			fn && fn.call(DOM);
		});
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
			var now = new Date();
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
	
	//通用拖动方法
	function drag(handle_dom,dom,param){
		var param = param || {};
		var moving = param['move'] || null;
		var start = param['start'] || null;
		var end = param['end'] || null;

		var dx, dy,l_start,t_start,w_start,h_start;
		bindHandler(handle_dom,'mousedown',down);
		function down(e){
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			dx = e.clientX;
			dy = e.clientY;
			l_start = getStyle(dom,'left');
			t_start = getStyle(dom,'top');
			w_start = outerWidth(dom);
			h_start = outerHeight(dom);
			
			start&&start();
			
			bindHandler(document,'mousemove',move);
			bindHandler(document,'mouseup',up);
			
		}
		function move(e){
			moving&&moving((e.clientX-dx),(e.clientY-dy),l_start,t_start,w_start,h_start);
			
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
		}
		function up(e) {
			removeHandler(document,'mousemove',move);
			removeHandler(document,'mouseup',up);
			end&&end();
		}
	}
	
    return{
		'TypeOf' : TypeOf,
		'each' : each,
		'css' : setCss,
		'supports' : supports,
		'slideDown' : slideDown,
		'slideUp' : slideUp,
		'fadeIn' : fadeIn,
		'fadeOut' : fadeOut,
		'zoomOut' : zoomOut,
		'animation' : function(a,b,c,d,e) {
			return new anim(a,b,c,d,e);
		},
		'createDom' : createDom,
		'removeNode' : removeNode,
		'createStyleSheet' : createStyleSheet,
		'findByClassName' : findByClassName,
		'hasClass' : hasClass,
		'offset' : offset,
		'getStyle' : getStyle,
		'outerWidth' : outerWidth,
		'outerHeight' : outerHeight,
		'ready' : ready,
		'bind' : bindHandler,
		'unbind' : removeHandler,
		'hide' : hide,
		'drag' : drag
    }
});