/**
 * 定义工具类
 * 包含dom查找，css样式，动画等
 */
define(function (window,document) {
	/**
	 * 判断对象类型
	 * string number array
	 * object function 
	 * htmldocument
	 * undefined null
	 */
	function TypeOf(obj) {
		return Object.prototype.toString.call(obj).match(/\s(\w+)/)[1].toLowerCase();
	}
	
	/**
	 * 检测是否为数字
	 * 兼容字符类数字 '23'
	 */
	function isNum(ipt){
		return (ipt !== '') && (ipt == +ipt) ? true : false;
	}
	
	/**
 	 * 遍历数组或对象
	 * 
	 */
	function each(arr,fn){
		//检测输入的值
		if(typeof(arr) != 'object' || typeof(fn) != 'function'){
			return;
		}
		var Length = arr.length;
		if( isNum(Length) ){
			for(var i=0;i<Length;i++){
				if(fn.call(this,i,arr[i]) === false){
					break
				}
			}
		}else{
			for(var i in arr){
				if (!arr.hasOwnProperty(i)){
					continue;
				}
				if(fn.call(this,i,arr[i]) === false){
					break
				}
			}
		}
	}
	
	/**
	 * 对象拷贝
	 *
	 */
	function clone(fromObj,toObj){
		each(fromObj,function(i,item){
			if(typeof item == "object"){   
				toObj[i] = item.constructor==Array ? [] : {};
				
				clone(item,toObj[i]);
			}else{
				toObj[i] = item;
			}
		});
		
		return toObj;
	}	
	/**
	 * 判断是否支持css属性
	 * 兼容css3
	 */
	var supports = (function() {
		var styles = document.createElement('div').style,
			vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);
		
		return function(prop) {
			var returns = false;
			if ( prop in styles ){
				returns = prop;
			}else{
				prop = prop.replace(/^[a-z]/, function(val) {
					return val.toUpperCase();
				});
				each(vendors,function(i,value){
					if ( value + prop in styles ) {
						returns = ('-' + value + '-' + prop).toLowerCase();
					}
				});
			}
			return returns;
		};
	})();
	
	
	var private_css3 = (supports('transition') && supports('transform')) ? true : false;
	
	/**
	 * 判断dom是否拥有某个class
	 */
	function hasClass(dom,classSingle){
		return dom.className && dom.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)')) || false;
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
		}else if (isNum(value) ){
			value = Number(value);
		} else if(value == '' || value == 'medium'){
			value = 0;
		} else if (value == 'auto'){
			if(prop == 'height'){
				value = elem.clientHeight;
			}else if(prop == 'width'){
				value = elem.clientWidth;
			}
		}
		
		return value;
	}
	

	/**
	 * dom设置样式
	 */
	function setStyle(elem,prop,value){
		prop = prop.toString();
		if (prop == "opacity") {
			elem.style.filter = 'alpha(opacity=' + (value * 100)+ ')';
			value = value;
		} else if ( isNum(value) && prop != 'zIndex'){
			value = value + "px";
		}
		elem.style[prop] = value;
	}
	//设置css
	function setCss(doms,cssObj){
		doms = [].concat(doms);
		
		/**
		 * 为css3属性增加扩展
		 */
		each(cssObj,function(key,value){
			if(key == 'transform' || key == 'transition'){
				each(['webkit','o','moz'],function(i,text){
					cssObj['-' + text + '-' + key] = value
				});
			}
		});
		each(doms,function(i,dom){
			each(cssObj,function(key,value){
				setStyle(dom,key,value);
			});
		});
	}
	
	/**
	 * css3动画
	 * 内部类，不检测参数
	 */
	function css3_anim(elem,cssObj,durtime,animType,onEnd){
		//记录初始transition值
		var transition_start = getStyle(elem,'transition');
		var cssSet = clone(cssObj,{
			'transition' : durtime + 'ms ' + animType
		});
		
		//开启3d加速
		if(!cssSet.transform){
			cssSet.transform = 'translate3d(0, 0, 0)';
		}else if(!cssSet.transform.match('translate3d')){
			cssSet.transform = cssSet.transform + ' translate3d(0, 0, 0)';
		}
		/**
		 * 动画结束回调
		 */
		function endFn(){
			endFn = null;
			elem.removeEventListener("webkitTransitionEnd",transitionFn, true);
			//还原transition值
			setCss(elem,{
				'transition' : transition_start || 'all 0s'
			});
			onEnd && onEnd.call(elem);
		}
		
		/**
		 * 高大上的webkitTransitionEnd
		 *   动画过程中，在每一帧持续触发
		 */
		var delay;
		function transitionFn(){
			clearTimeout(delay);
			delay = setTimeout(function(){
				endFn && endFn();
			},40);
		}
		elem.addEventListener("webkitTransitionEnd",transitionFn, true);
		
		/**
		 * 加一份保险
		 *   解决 css无变化时webkitTransitionEnd事件不会被触发的问题
		 */
		setTimeout(function(){
			endFn && endFn();
		},durtime + 80);
		
		/**
		 * 不知道为啥，若刚设置完css再修改同一属性，firefox下没效果
		 *   可能是浏览器优化css动画的逻辑
		 *	 故加定时器解决此bug
		 */
		setTimeout(function(){
			setCss(elem,cssSet);
		},10);
	}
	/**
	 * css3动画
	 * @param elem dom对象
	 * @param cssObj 动画对象
	 * @param durtime 持续时间
	 * @param [animType] 缓动类型
	 * @param [callback] 回调
	 */
	function animation(elem,cssObj,durtime,a,b) {
        var animType = "linear",
			onEnd = null;
		
		if (arguments.length < 3) {
			throw new Error("missing arguments [dom,cssObj,durtime]");
		} else {
			if (TypeOf(a) == "function") {
				onEnd = a;
			}else if (typeof (a) == "string") {
				animType = a;
			}
			
			if (TypeOf(b) == "function") {
				onEnd = b;
			}
		}
		if(private_css3){
			return css3_anim(elem,cssObj,durtime,animType,onEnd);
		}else{
			setCss(elem,cssObj);
			onEnd && onEnd.call(elem);
		}
	}
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
			var output = elem.getBoundingClientRect().width;
			
			return typeof(output) == 'number' ? output : count_outerWidth(elem);
		};
		outerHeight = function(elem){
			var output = elem.getBoundingClientRect().height;
			
			return typeof(output) == 'number' ? output : count_outerHeight(elem);
		};
	}else{
		outerWidth = count_outerWidth;
		outerHeight = count_outerHeight;
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
			if(target == dom || !target){
				return false;
			}
			if(hasClass(target,classStr)){
				return target;
			}
			
			target = target.parentNode;
		}
	}
	function bind(elem, type,a,b){
		var className,fn;
		if(typeof(a) == 'string'){
			className = a.replace(/^\./,'');
			fn = b;
			callback = function(e){
				var bingoDom = checkEventForClass(e,className,elem);
				if(bingoDom){
					fn && fn.call(bingoDom);
				}
			};
		}else{
			callback = a;
		}
		bindHandler(elem,type,callback);
	}
	
	
    return {
		TypeOf : TypeOf,
		isNum : isNum,
		each : each,
		getStyle : getStyle,
		css : setCss,
		animation : animation,
		supports : supports,
		outerWidth : outerWidth,
		outerHeight : outerHeight,
		bind : bind,
		clone : clone,
		unbind : removeHandler,
		hasClass : hasClass,
		'addClass' : function (dom, cls) {
			if (!this.hasClass(dom, cls)) dom.className += " " + cls;
		},
		'removeClass' : function (dom, cls) {
			if (hasClass(dom, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				dom.className = dom.className.replace(reg, ' ');
			}
		},
		/**
		 * 页面加载
		 */
		ready : (function(){
			var readyFns = [];
			function completed() {
				removeHandler(document,"DOMContentLoaded", completed);
				removeHandler(window,"load", completed);
				each(readyFns,function(i,fn){
					fn();
				});
				readyFns = null;
			}
			return function (callback){
				if ( document.readyState === "complete" ) {
					callback && callback();
				} else {
					callback && readyFns.push(callback);
					
					bindHandler(document,'DOMContentLoaded',completed);
					bindHandler(window,'load',completed);
				}
			}
		})(),
		//通用拖动方法
		drag : function drag(handle_dom,dom,param){
			var param = param || {};
			var onStart = param.start || null;
			var onMove = param.move || null;
			var onEnd = param.end || null;
			
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
		},
		//创建dom
		createDom : function (html){
			var a = document.createElement('div');
			a.innerHTML = html;
			return a.childNodes;
		},
		//在指定DOM后插入新DOM
		insertAfter : function (newElement, targetElement){
			var parent = targetElement.parentNode;
			if (parent.lastChild == targetElement) {
				//如果最后的节点是目标元素，则直接追加
				parent.appendChild(newElement);
			} else {
				//插入到目标元素的下一个兄弟节点之前
				parent.insertBefore(newElement, targetElement.nextSibling);
			}
		},
		//移除dom节点
		removeNode : function (elem){  
			if(elem && elem.parentNode && elem.tagName != 'BODY'){  
				elem.parentNode.removeChild(elem);  
			}  
		},
		//创建style标签
		createStyleSheet : function (cssStr,attr){
			var styleTag = document.createElement('style');
			
			attr = attr || {};
			attr.type = "text/css";
			//设置标签属性
			each(attr,function(i,value){
				styleTag.setAttribute(i, value);
			});
			
			// IE
			if (styleTag.styleSheet) {
				styleTag.styleSheet.cssText = cssStr;
			} else {
				var tt1 = document.createTextNode(cssStr);
				styleTag.appendChild(tt1);
			}
			//插入页面中
			(document.head || document.getElementsByTagName('head')[0]).appendChild(styleTag);
			return styleTag;
		},
		//根据class查找元素
		findByClassName : (function(){
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
		offset : function (elem){
			var box = {
				top : 0,
				left : 0,
				screen_top : 0,
				screen_left : 0
			},
			size;
			
			if (typeof(elem.getBoundingClientRect) !== 'undefined' ) {
				size = elem.getBoundingClientRect();
			}
			box.screen_top = size.top;
			box.screen_left = size.left;
			
			box.top = size.top + (document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop);
			box.left = size.left + document.body.scrollLeft;
			
			return box;
		},
		//淡入
		fadeIn : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			setCss(DOM,{
				'opacity' : 0,
				'display' : 'block'
			});
			animation(DOM,{
				'opacity' : op
			}, time, function(){
				fn && fn.call(DOM);
			});
		},
		//淡出
		fadeOut : function (DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			animation(DOM,{
				'opacity' : 0
			}, time,function(){
				DOM.style.opacity = op;
				DOM.style.display = 'none';
				fn && fn.call(DOM);
			});
		},
		render : function (str, data){
			if(!str || !data){
				return '';
			}
			return (new Function("obj",
				"var p=[];" +
				"with(obj){p.push('" +
				str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
			+ "');}return p.join('');"))(data);
		}
    }
});
