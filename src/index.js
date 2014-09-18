/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified requires('Date')
 * 
 **/

(function(global,doc,UI_factory,utils_factory){
	
	//初始化工具类
	var utils = utils_factory(global,doc);
	
	//初始化UI模块
	var UI = UI_factory(global,doc,utils);
	
	//提供window.UI的接口
	global.UI = global.UI || UI;
	global.UI._utils = utils;
	
	//提供CommonJS规范的接口
	global.define && define(function(){
		return UI;
	});
})(window,document,function(window,document,utils){
	/**
	 * 缓存utils下常用工具
	 *   为压缩变量名做准备
	 */
	var isNum = utils.isNum,
		setCSS = utils.css,
		getCSS = utils.getStyle,
		animation = utils.animation,
		outerWidth = utils.outerWidth,
		outerHeight = utils.outerHeight,
		findByClassName = utils.findByClassName,
		bindEvent = utils.bind;
	
	/**
	 * 基础模版
	 */
	var allCnt_tpl = requires('template/base.html'),
		pop_tpl = requires('template/pop.html'),
		confirm_tpl = requires('template/confirm.html'),
		ask_tpl = requires('template/ask.html'),
		confirmBar_tpl = requires('template/confirmBar.html'),
		plane_tpl = requires('template/plane.html'),
		prompt_tpl = requires('template/prompt.html'),
		cover_tpl = requires('template/cover.html'),
		select_tpl = requires('template/select.html'),
		popCSS = requires('style.css');
	
	var isIE67 = isIE678 = false;
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true;
			isIE678 = true;
		}else if(version == "MSIE8.0"){
			isIE678 = true;
		}
	}
	
	/**
	 * 定义私有变量
	 * 
	 **/ 
	var private_allCnt = utils.createDom(allCnt_tpl)[0],
		private_maskDom = findByClassName(private_allCnt,'UI_mask')[0],
		private_body = document.body,
		private_docW,
		private_winH,
		private_docH,
		private_scrollTop;

	var private_CONFIG = {
		'gap' : {
			'top' : 0,
			'left' : 0,
			'bottom' : 0,
			'right' : 0
		},
		'zIndex' : 499
	};
	var docDom;
	if (document.compatMode == "BackCompat") {
		docDom = private_body;
	}else{
		//"CSS1Compat"
		docDom = document.documentElement;
	}
	function refreshSize(){
		//重新计算窗口尺寸
		private_scrollTop = docDom.scrollTop == 0 ? private_body.scrollTop : docDom.scrollTop;
		private_winH = window.innerHeight || document.documentElement.clientHeight;
		private_docH = docDom.scrollHeight;
		private_docW = docDom.clientWidth;
	}
	
	
	//初始化组件基础功能
//	utils.ready(function(){
		//插入css样式表
		var styleSheet = utils.createStyleSheet(popCSS,{'data-module' : "UI"});
		
		//插入基础dom
		private_body.appendChild(private_allCnt);
		
		//释放掉无用的内存
		popCSS = null;
		allCnt_tpl = null;
		
		//更新窗口尺寸
		refreshSize();
		setTimeout(refreshSize,500);
		
		if(isIE678){
			utils.addClass(private_allCnt,'UI_ie678');
		}
		
		var rebuild_fn = null;
		if(isIE67){
			rebuild_fn = function(){
				refreshSize();
				setCSS(private_maskDom,{
					'marginTop' : private_scrollTop
				});
			};
		}else{
			setCSS(private_maskDom,{
				'position' : 'fixed',
				'top' : 0
			});
			rebuild_fn = refreshSize;
		}
		
		//监听浏览器缩放、滚屏事件
		bindEvent(window,'resize',rebuild_fn);
		bindEvent(window,'scroll',rebuild_fn);
//	});
	
	//限制位置区域的方法
	function fix_position(top,left,width,height){
		var gap = private_CONFIG.gap;
		if(top<private_scrollTop + gap.top){
			//屏幕上方
			top = private_scrollTop  + gap.top;
		}else if(top + height - private_scrollTop > private_winH - gap.bottom) {
			//屏幕下方
			if(height > private_winH - gap.top - gap.bottom){
				//比屏幕高
				top = private_scrollTop + gap.top;
			}else{
				//比屏幕矮
				top = private_scrollTop + private_winH - height - gap.bottom;
			}
		}
		if(left < gap.left){
			left =  gap.left;
		}else if(left + width > private_docW - gap.right){
			left = private_docW - width - gap.right;
		}
		
		return {
			'top' : Math.ceil(top),
			'left' : Math.ceil(left)
		}
	}
	//设置dom自适应于页面
	function adaption(dom,param,time){
		var param = param ||{},
			width = outerWidth(dom),
			height = outerHeight(dom),
			top = (private_winH - height)/2 + private_scrollTop,
			left = (private_docW - width)/2,
			newPosition = fix_position(top,left,width,height),
			method = setCSS;
		if(isNum(time)){
			method = animation;
		}
		method(dom,{
			'top' : isNum(param.top) ? param.top : Math.ceil(newPosition.top),
			'left' : isNum(param.left) ? param.left : Math.ceil(newPosition.left)
		},time);
	}
	
	//增加确认方法
	function add_confirm(dom,param,close){
		var callback = null;
		var cancel = null;
		var btns = ['\u786E\u8BA4','\u53D6\u6D88'];
		if(typeof(param) == "function"){
			callback = param;
		}else if(typeof(param) == "object"){
			var paramBtns = param.btns || [];
			btns[0] = paramBtns[0] || btns[0];
			btns[1] = paramBtns[1] || btns[1];
			if(typeof(param.callback) == "function"){
				callback = param.callback;
			}
			if(typeof(param.cancel) == "function"){
				cancel = param.cancel;
			}
		}
		var this_html = utils.render(confirmBar_tpl,{
			'confirm' : btns[0],
			'cancel' : btns[1]
		});
		dom.appendChild(utils.createDom(this_html)[0]);
		
		//绑定事件，根据执行结果判断是否要关闭弹框
		bindEvent(dom,'click','.UI_pop_confirm_ok',function(){
			//点击确认按钮
			callback ? ((callback() != false) && close()) : close();
		});
		bindEvent(dom,'click','.UI_pop_confirm_cancel',function(){
			//点击取消按钮
			cancel ? ((cancel() != false) && close()) : close();
		});
	}
	
	/**
	 * 处理对象易于关闭的扩展
	 *   点击自身以外 or 按下esc
	 */
	 //当前打开状态的对象
	private_active = [];
	//关闭最上一个
	function closeActive(){
		var item = null;
		while(1){
			item = private_active.pop();
			if(!item || !item.dead){
				break
			}
		}
		item && item.close();
	}
	//检测body的mouseup事件
	bindEvent(private_body,'mouseup',function checkClick(event) {
		var target = event.srcElement || event.target;
		setTimeout(function(){
			while (!utils.hasClass(target,'UI_easyClose')) {
				target = target.parentNode;
				if(!target){
					closeActive();
					break
				}
			}
		});
	});
	//检测window的keydown事件（esc）
	bindEvent(private_body,'keyup',function checkClick(event) {
		if(event.keyCode == 27){
			closeActive();
		}
	});
	
	/**
	 * 对象易于关闭方法拓展
	 *   mark 为当前参数
	 *   default_value 为默认参数
	 */
	function easyCloseHandle(mark,default_value){
		var me = this;
		if(typeof(mark) == 'boolean' ? mark : default_value){
			utils.addClass(me.dom,'UI_easyClose');
			setTimeout(function(){
				private_active.push(me);
			});
		}
	}
	
	
	/**
	 * 模糊效果
	 */
	function addRootElements(callback){
		var doms = private_body.childNodes;
		utils.each(doms,function(i,dom){
			if(dom != private_allCnt && dom.nodeType ==1 && dom.tagName != 'SCRIPT' && dom.tagName != 'LINK' && dom.tagName != 'STYLE'){
				callback(dom);
			}
		});
	}
	var blur = removeBlur = null;
	if(utils.supports('-webkit-filter')){
		blur = function (){
			addRootElements(function(dom){
				utils.addClass(dom,'UI-blur');
			});
		};
		removeBlur = function (){
			addRootElements(function(dom){
				utils.removeClass(dom,'UI-blur');
			});
		};
	}
	
	//存储蒙层信息
	var maskObjs = [];
	//获取最后一个蒙层信息
	function maskObjsLast(){
		var len = maskObjs.length;
		return len ? maskObjs[len-1] : null;
	}
	
	/**
	 * 显示蒙层 
	 */
	function showMask(callback){
		var lastMask = maskObjsLast();
		zIndex = lastMask ? lastMask[1] + 2 : 2;
		setCSS(this.dom,{
			'zIndex': zIndex
		});
		if(!this._mask){
			callback && callback();
			return;
		}
		setCSS(private_maskDom,{
			'zIndex': zIndex - 1
		});
		
		if(lastMask){
			//尚有需要蒙层的元素
			callback && callback();
		}else{
			//没有需要蒙层的元素，关闭蒙层
			if(!isIE678){
				utils.fadeIn(private_maskDom,500,function(){
					callback && callback();
				});
				blur && blur();
			}else{
				setCSS(private_maskDom,{
					'display':'block'
				});
				callback && callback();
			}
		}
		maskObjs.push([this,zIndex]);
	}
	//在指定DOM后插入新DOM
	function insertAfter(newElement, targetElement){
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			// 如果最后的节点是目标元素，则直接追加
			parent.appendChild(newElement);
		} else {
			//插入到目标元素的下一个兄弟节点之前
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}
	
	/**
	 * 计算动画所需的方向及目标值
	 *   @returns[0] 所需修改的方向
	 *   @returns[1] 当前方向的值
	 *   @returns[2] 计算后的值
	 */
	function countAnimation(DOM,direction,range){
		var prop,
			start,
			result;
		
		if(direction == 'left' || direction == 'right'){
			//判断dom水平定位依据
			var left = getCSS(DOM,'left');
			if(left != 'auto'){
				prop = 'left';
				start = left;
			}else{
				prop = 'right';
				start = getCSS(DOM,'right');
			}
		}else{
			//判断dom垂直定位依据
			var top = getCSS(DOM,'top');
			if(top != 'auto'){
				prop = 'top';
				start = top;
			}else{
				prop = 'bottom';
				start= getCSS(DOM,'bottom');
			}
		}
		result = (prop == direction) ? start + range : start - range;
		return [prop,start,result];
	}
	/**
	 * 开场动画
	 *   创建一个dom用来完成动画
	 *   动画结束，设置dom为结束样式
	 **/
	var openAnimation = isIE678 ? function (a,b,c,d,fn){
		fn && fn();
	} : function (DOM,from,time,animation_range,fn){
		if(!from || from == 'none' || !animation_range){
			fn && fn();
			//不需要动画
			return
		}
		var offset = utils.offset(DOM);
		
		//动画第一帧css
		var cssStart = {},
			//动画需要改变的css
			cssAnim = {};
		
		//参数是dom对象
		if(from.tagName && from.parentNode){
			time = 200;
			var offset_from = utils.offset(from);
			cssStart = {
				'top' : offset_from.top,
				'left' : offset_from.left,
				'width' : outerWidth(from),
				'height' : outerHeight(from),
				'overflow' : 'hidden'
			};
			cssAnim = {
				'width' : getCSS(DOM,'width'),
				'height' : getCSS(DOM,'height'),
				'top' : getCSS(DOM,'top'),
				'left' : getCSS(DOM,'left')
			};
		//参数是字符串
		}else if(typeof(from) == 'string'){
			var countResult = countAnimation(DOM,from,-animation_range);
			cssStart[countResult[0]] = countResult[2];
			cssAnim[countResult[0]] = countResult[1];
		}
		//拷贝dom用来完成动画
		var html = DOM.outerHTML;
		//FIXME 过滤iframe正则随便写的
		html = html.replace(/<iframe.+>\s*<\/iframe>/ig,'');
		var animDom = utils.createDom(html)[0];
		//为了效果跟流畅，隐藏内容部分
		var cntDom = findByClassName(animDom,'UI_cnt')[0];
		insertAfter(animDom,DOM);
		if(cntDom){
			setCSS(animDom,{
				'height' : outerHeight(DOM)
			});
			cntDom.innerHTML = '';
		}
		
		
		//隐藏真实dom
		setCSS(DOM,{
			'display' : 'none'
		});
		
		//放置于初始位置
		cssStart.opacity = 0;
		setCSS(animDom,cssStart);
		//动画开始
		cssAnim.opacity = 1;
		animation(animDom,cssAnim,time,'SineEaseIn',function(){
			//删除动画dom
			utils.removeNode(animDom);
			//显示真实dom
			setCSS(DOM,{
				'display' : 'block'
			});
			fn && fn();
		});
	};
	/**
	 * 处理对象关闭及结束动画
	 */
	function closeAnimation(time_define,animation_range,fn){
		return function(time){
			var me = this;
			
			//检测、记录自己是否“活着”
			if(me.dead){
				return;
			}
			me.dead = true;
			
			//处理关闭回调、蒙层检测
			var DOM = me.dom;
			fn && fn.call(me);
			function endFn(){
				utils.removeNode(DOM);
				me.closeFn && me.closeFn();
				/**
				 * 关闭蒙层
				 */
				if(me._mask){
					utils.each(maskObjs,function(index,item){
						if(item[0] == me){
							maskObjs.splice(index,1);
							return false;
						}
					});
					var lastMask = maskObjsLast();
					setCSS(private_maskDom,{
						'zIndex' : (lastMask ? lastMask[1]-1 : 1)
					});
					
					if(!lastMask){
						removeBlur && removeBlur();
						if(!isIE678){
							utils.fadeOut(private_maskDom,400);
						}else{
							setCSS(private_maskDom,{'display':'none'});
						}
					}
				}
			}
			
			if(isIE678){
				endFn();
				return
			}
			
			var time = isNum(time) ? time : parseInt(time_define) || 80;
			var from = me._from;
			
			var range = animation_range || 80;
			
			var cssEnd = {
				'opacity' : 0
			};
			if(from && from.tagName && from.parentNode){
				utils.zoomOut(DOM,time,function(){
					endFn();
				});
			}else if(typeof(from) == 'string'){
				
				var countResult = countAnimation(DOM,from,-range);
				cssEnd[countResult[0]] = countResult[2];
				
				//动画开始
				animation(DOM,cssEnd,time,'SineEaseIn',function(){
					endFn();
				});
			}else{
				endFn();
			}
		}
	}
	
	/**
	 * 弹框
	 * pop 
	 */
	function POP(param){
		var param = param || {};
		var me = this;
		
		me.dom = utils.createDom(pop_tpl)[0];
		me.cntDom = findByClassName(me.dom,'UI_cnt')[0];
		me.closeFn = param.closeFn || null;
		me._mask = param.mask || false;
		me._from = param.from || 'top';
		

		//当有确认参数时
		if(param.confirm){
			add_confirm(me.dom,param.confirm,function(){
				me.close();
			});
		}
		//处理title参数
		var caption_dom = findByClassName(me.dom,'UI_pop_cpt')[0];
		if(!param.title){
			utils.removeNode(caption_dom);
		}else{
			var title = param.title || 'need title in parameter!';
			
			caption_dom.innerHTML = title;
			//can drag is pop
			utils.drag(caption_dom,me.dom,{
				'move' : function(mx,my,l_start,t_start,w_start,h_start){
					var left = mx + l_start;
					var top = my + t_start;
					
					var newSize = fix_position(top,left,w_start,h_start);
					setCSS(me.dom,{
						'left' : newSize.left,
						'top' : newSize.top
					});
				}
			});
		}
		
		bindEvent(me.dom,'click','.UI_pop_close',function(){
			me.close();
		});
		
		showMask.call(me,function(){
			var this_width = Math.min(param.width || 600,private_docW-20);
			
			//插入内容
			me.cntDom.innerHTML = param.html || '';
			
			//设置宽度，为计算位置尺寸做准备
			setCSS(me.dom,{
				'width' : this_width
			});
			private_allCnt.appendChild(me.dom);
			
			//校正位置
			adaption(me.dom,param);
			
			//开场动画
			openAnimation(me.dom,me._from,200,80,function(){
				//处理是否易于关闭
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
	}
	//使用close方法
	POP.prototype.close = closeAnimation(500);
	POP.prototype.adapt = function(){
		adaption(this.dom,null,100);
	};

	/**
	 * CONFIRM 
	 */
	function CONFIRM(param){
		var param = param || {};
		var me = this;
		
		var this_html = utils.render(confirm_tpl,{
			'text' : param.text || 'need text in parameter!'
		});
		me.dom = utils.createDom(this_html)[0];
		me.closeFn = param.closeFn || null;
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
		me._from = param.from || 'top';
		
		add_confirm(me.dom,param,function(){
			me.close();
		});
		//显示蒙层
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			
			adaption(me.dom);
			
			openAnimation(me.dom,me._from,100,80,function(){
				//处理是否易于关闭
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
	}
	CONFIRM.prototype.close = closeAnimation(200);


	/**
	 * ASK 
	 */
	function ASK(text,callback,param){
		var me = this;
		var param = param || {};
		
		var this_html = utils.render(ask_tpl,{
			'text' : text || 'need text in parameter!'
		});

		me.dom = utils.createDom(this_html)[0];
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
		me._from = param.from || 'top';
		me.inputDom = findByClassName(me.dom,'UI_ask_key')[0];
		me.closeFn =  null;
		
		var confirm_html = utils.render(confirmBar_tpl,{
			'confirm' : '确定',
			'cancel' : '取消'
		});
		
		me.dom.appendChild(utils.createDom(confirm_html)[0]);
		
		//确定
		bindEvent(me.dom,'click','.UI_pop_confirm_ok',function(){
			//根据执行结果判断是否要关闭弹框
			callback ? ((callback(me.inputDom.value) != false) && me.close()) : me.close();
		});
		//取消
		bindEvent(me.dom,'click','.UI_pop_confirm_cancel',function(){
			me.close();
		});

		//显示蒙层
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			
			adaption(me.dom);
			
			openAnimation(me.dom,me._from,100,80,function(){
				me.inputDom.focus();
				//处理是否易于关闭
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
		
	}
	ASK.prototype.close = closeAnimation(200);
	ASK.prototype.setValue = function(text){
		this.inputDom.value = text.toString();
	};


	/**
	 * prompt
	 * 
	 **/
	function PROMPT(text,time,param){
		var param = param || {};
		var me = this;
		me.dom = utils.createDom(prompt_tpl)[0];
		me._from = param.from || 'bottom';
		me._mask = param.mask ? true : false;
		me.tips(text,time);
		
		// create pop
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			adaption(me.dom);
			
			openAnimation(me.dom,me._from,100,30);
		});
	}
	PROMPT.prototype.close = closeAnimation(80);
	PROMPT.prototype.tips = function(txt,time){
		var me = this;
		if(txt){
			findByClassName(this.dom,'UI_cnt')[0].innerHTML = txt;
		}
		if(time != 0){
			setTimeout(function(){
				me.close();
			},(time || 1500));
		}
	};

	/**
	 *	PLANE 
	 */
	function PLANE(param){
		var me = this;
		var param = param || {};
		
		me.closeFn = param.closeFn || null;
		me.dom = utils.createDom(plane_tpl)[0];
		me._from = param.from || null;
		
		//insert html
		me.dom.innerHTML = param.html || '';
		
		setCSS(me.dom,{
			'width' : param.width || 240,
			'height' : param.height || null,
			'top' : isNum(param.top) ? param.top : 300,
			'left' : isNum(param.left) ? param.left : 800
		});
		showMask.call(me,function(){
			private_allCnt.appendChild(me.dom);
			openAnimation(me.dom,me._from,100,80,function(){
				//处理是否易于关闭
				easyCloseHandle.call(me,true);
			});
		});
	}
	PLANE.prototype.close = closeAnimation(200);


	/***
	 * 全屏弹框
	 * COVER 
	 */
	function COVER(param){
		var param = param || {};
		var me = this;
		me.dom = utils.createDom(cover_tpl)[0];
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : false;
		me._from = param.from || 'top';
		
		me.cntDom = findByClassName(me.dom,'UI_cnt')[0];
		me.closeFn = param.closeFn || null;
		
		
		//关闭事件
		bindEvent(me.dom,'click','.UI_close',function(){
			me.close();
		});

		
		//记录body的scrollY设置
		me._bodyOverflowY = getCSS(private_body,'overflowY');
		var cssObj = {
			'width' : isNum(param.width) ? Math.min(private_docW,param.width) : null,
			'height' : isNum(param.height) ? Math.min(private_winH,param.height) : private_winH
		};
		//水平定位
		if(isNum(param.right)){
			cssObj.right = param.right;
		}else if(isNum(param.left)){
			cssObj.left = param.left;
		}else{
			cssObj.position = 'relative';
			cssObj.margin = 'auto';
		}
		//垂直定位
		if(isNum(param.bottom)){
			cssObj.top = private_winH - cssObj.height - param.bottom + private_scrollTop;
		}else if(isNum(param.top)){
			cssObj.top = private_scrollTop + param.top;
		}else{
			cssObj.top = private_scrollTop + (private_winH - cssObj.height)/2
		}
		//打开蒙层
		showMask.call(me,function(){
			setCSS(me.dom,cssObj);
			private_allCnt.appendChild(me.dom);
			
			openAnimation(me.dom,me._from,200,400,function(){
				setCSS(private_body,{
					'overflowY' : 'hidden'
				});
				//处理是否易于关闭
				easyCloseHandle.call(me,true);
			});
		});
		//insert html
		me.cntDom.innerHTML = param.html || '';
	}
	//使用close方法
	COVER.prototype.close = closeAnimation(400,500,function(){
		setCSS(this.cntDom,{
			'overflowY' : 'hidden'
		});
		setCSS(private_body,{
			'overflowY' : this._bodyOverflowY
		});
	});

	/**
	 * 选择功能
	 */
	function SELECT(list,param){
		var me = this,
			param = param || {},
			list = list || [],
			fns = [],
			nameList = [];
		
		utils.each(list,function(i,item){
			nameList.push(item[0]);
			fns.push(item[1]);
		});
		var this_html = utils.render(select_tpl,{
			'list' : nameList,
			'title' : param.title || null,
			'intro' : param.intro || null
		});
		
		me.dom = utils.createDom(this_html)[0];
		me.closeFn = param.closeFn || null;
		me._from = param.from || 'bottom';
		me._mask = private_docW > 640 ? param.mask : true;
		
		//绑定事件
		var btns = findByClassName(me.dom,'UI_select_btn');
		utils.each(btns,function(index,btn){
			bindEvent(btn,'click',function(){
				fns[index] && fns[index]();
				me.close();
			});
		});
		
		//显示蒙层
		showMask.call(me,function(){
			if(private_docW < 640 && !isIE678){
				//手机版
				me._from = 'bottom';
				private_allCnt.appendChild(me.dom);
			}else{
				var cssObj = {
					'top' : param.top || 100,
					'left' : param.left || 100,
					'width' : param.width || 200
				};
				private_allCnt.appendChild(me.dom);
				
				setCSS(me.dom,cssObj);
				var newSize = fix_position(cssObj.top,cssObj.left,cssObj.width,outerHeight(me.dom));
				setCSS(me.dom,{
					'left' : newSize.left,
					'top' : newSize.top
				});
			}
			openAnimation(me.dom,me._from,200,400,function(){
				easyCloseHandle.call(me,param.easyClose,true);
			});
		});
		
	}
	SELECT.prototype.close = closeAnimation(200);
	/**
	 *  抛出对外接口
	 */
	return {
		'pop' : function(){
			return new POP(arguments[0]);
		},
		'config' : {
			'gap' : function(name,value){
				//name符合top/right/bottom/left,且value值为数字类型（兼容字符类型）
				if(name && typeof(private_CONFIG.gap[name]) == 'number' && isNum(value)){
					private_CONFIG.gap[name] = parseInt(value);
				}
			},
			'zIndex' : function(num){
				var num = parseInt(num);
				if(num > 0){
					private_CONFIG.zIndex = num;
					setCSS(private_allCnt,{
						zIndex : num
					});
				}
			}
		},
		'confirm' : function(){
			return new CONFIRM(arguments[0]);
		},
		'ask' : function(text,callback,param){
			return new ASK(text,callback,param);
		},
		'prompt' : function(txt,time,param){
			return new PROMPT(txt,time,param);
		},
		'plane' : function(){
			return new PLANE(arguments[0]);
		},
		'cover' : function(){
			return new COVER(arguments[0]);
		},
		'select' : function(){
			return new SELECT(arguments[0],arguments[1]);
		}
	};
},requires('utils.js'));