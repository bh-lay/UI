/**
 * 定义工具类
 * 包含dom查找，css样式，动画等
 */
define(function () {
	var private_frame_time = 1000 / 60;
	
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
		//dom有class 检测，无class，直接返回false
		return (dom.className && dom.className.length) ? dom.className.match(new RegExp('(\\s|^)' + classSingle +'(\\s|$)')) : false;
	}
	//获取样式
	function getStyle(elem, attr) {
		var w3style;
		attr == "borderWidth" ? attr = "borderLeftWidth" : attr;
		if (elem.style[attr]){
			w3style = elem.style[attr];
		} else if(document.defaultView) {
			var style = document.defaultView.getComputedStyle(elem, null);
			w3style = attr in style ? style[attr] : style.getPropertyValue(attr);
		} else if (elem.currentStyle) {
			w3style = elem.currentStyle[attr];
		}
		//w3style == "auto" ? w3style = "0px" : w3style;
		return w3style;
	}
	
	// 此处只能获取属性值为数值类型的style属性
	function getOriCss (elem, cssObj) {
		var cssOri = [];
		for (var prop in cssObj) {
			if (!cssObj.hasOwnProperty(prop)){
				continue;
			}
			
			var value = getStyle(elem, prop);
			
			if (value == "transparent") {
				value = [255, 255, 255,0];
			}else if (/^#/.test(value)) {
				value = color.GetColors(value);
			} else if (/^rgb/.test(value)) {
				//获得css值为rgba或rgb对应值（数组）
				value = value.match(/([0-9]+)/g);
			} else if (prop == "opacity") {
				value = 100 * value;
			} else {
				value = parseInt(value);
			}
			
			cssOri.push(value);
		}
		return cssOri;
	}
    function parseCssObj (cssobj) {
		var cssEnd = [];
		for (var prop in cssobj) {
			if (!cssobj.hasOwnProperty(prop)) continue;
			//if (prop != "opacity") cssEnd.push(parseInt(cssobj[prop]));
			//else cssEnd.push(100 * cssobj[prop]);
			if (prop == "opacity") {
				cssEnd.push(100 * cssobj[prop]);
			} else if (/^#/.test(cssobj[prop])) {
				cssEnd.push(color.GetColors(cssobj[prop]));
			} else {
				cssEnd.push(parseInt(cssobj[prop]));
			}
		}
		return cssEnd;
	}

	/**
	 * dom设置样式
	 */
	function setStyle(elem,prop,value){
		if(value == null){
			return
		}
		prop = prop.toString();
		if (prop == "opacity") {
			value = value / 100;
		} else if (value == +value){
			value = value + "px";
		}
		
		elem.style[prop] = value;
	}
	//设置css
	function setCss(dom,cssObj){
		var cssVal = parseCssObj(cssObj);
		
		for (var pro in cssObj) {
			if (!cssObj.hasOwnProperty(pro)){
				continue;
			}
			setStyle(dom,pro,cssObj[pro]);
		}
		
	}
	var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, private_frame_time); // shoot for 60 fps
				};
    })();
	
	/**
	 * 动画类
	 *
	 */
    function anim() {
		var args = arguments;
        this.elem = args[0];
		this.cssObj = args[1];
		this.cssOri = getOriCss(this.elem, args[1]);
		this.cssEnd = parseCssObj(args[1]);
		this.durtime = args[2];
		this.animType = "Linear";
		this.onPause = null;
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
    anim.prototype = {
        startAnim: function () {
            var me = this;
			//全部时间 | 开始时间
			var time_all = this.durtime;
			var time_start = new Date();
			
			//运动曲线方程
			var aniFunction = (eval(me.animType));
			
            //获得需要操作的属性名
			var props = [];
            for (var pro in this.cssObj) {
                if (!this.cssObj.hasOwnProperty(pro)){
					continue;
				}
                props.push(pro);
            }
			
			//显示当前帧（递归）
			function showFrame(){
				var time_use = new Date() - time_start;
				
				if (time_use < time_all) {
					requestAnimationFrame(showFrame);
				}else{
					time_use = time_all;
					me.onEnd && me.onEnd.call(me, me.elem);
				}
				
				for (var i = 0; i < props.length; i++) {
					var value = countNewCSS(me.cssOri[i],me.cssEnd[i],time_use,time_all,aniFunction);
					setStyle(me.elem,props[i],value);
				}
			//	console.log(time_all,time_use);
			}
			requestAnimationFrame(showFrame);
        },
        pause: function () {
            this.onPause = true;
        }
    }
	//给定计算方式，得出新的CSS值
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
			output = fn(use_time, start, (end-start), all_time);
		}
		return output
	}
	
	//创建dom
	function createDom(str){
		var a = document.createElement('div');
		a.innerHTML = str;
		return a.childNodes;
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
		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			size = elem.getBoundingClientRect();
		}
		box.top = size.top + document.body.scrollTop;
		box.left = size.left + document.body.scrollLeft;
		
		return box;
	}
	function outerWidth (elem){
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			return elem.getBoundingClientRect()['width'];
		}else{
			return (parseInt(getStyle(elem,'borderLeftWidth')) + parseInt(getStyle(elem,'paddingLeft')) + parseInt(getStyle(elem,'width')) + parseInt(getStyle(elem,'paddingRight')) + parseInt(getStyle(elem,'borderRightWidth')));
		}
	}
	function outerHeight (elem){
		if ( typeof elem.getBoundingClientRect !== 'undefined' ) {
			return elem.getBoundingClientRect()['height'];
		}else{
			return (parseInt(getStyle(elem,'borderTopWidth')) + parseInt(getStyle(elem,'paddingTop')) + parseInt(getStyle(elem,'height')) + parseInt(getStyle(elem,'paddingBottom')) + parseInt(getStyle(elem,'borderBottomWidth')));
		}
	}
	
	//根据class查找元素
	var findByClassName = (function(){
		if(document.getElementsByClassName !== 'undefined'){
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
			'height' : 0,
			'padding' : 0
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
	
	
	
	/**
	 * 页面加载
	 */
	var readyFns = [];
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
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
			document.addEventListener( "DOMContentLoaded", completed, false );
			window.addEventListener( "load", completed, false );
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
	
    return{
		'css' : setCss,
		'slideDown' : slideDown,
		'slideUp' : slideUp,
		'fadeIn' : fadeIn,
		'fadeOut' : fadeOut,
		'animation' : function(a,b,c,d,e) {
			return new anim(a,b,c,d,e);
		},
		'createDom' : createDom,
		'findByClassName' : findByClassName,
		'hasClass' : hasClass,
		'offset' : offset,
		'getStyle' : getStyle,
		'outerWidth' : outerWidth,
		'outerHeight' : outerHeight,
		'ready' : ready,
		'bind' : bindHandler,
		'unbind' : removeHandler,
		'hide' : hide
    }
});