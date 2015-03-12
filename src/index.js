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
		gap : {
			top : 0,
			left : 0,
			bottom : 0,
			right : 0
		},
		zIndex : 499
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
		private_winW = window.innerWidth || document.documentElement.clientWidth;
		private_docH = docDom.scrollHeight;
		private_docW = docDom.clientWidth;
	}
	//记录当前正在显示的对象
	var active_objs = [];
	//从记录中移除对象
	function remove_active_obj(obj){
		utils.each(active_objs,function(index,item){
			if(item == obj){
				active_objs.splice(index,1);
				return false;
			}
		});
	}
	//关闭最后一个正在显示的易于关闭的对象
	function close_last_easyClose_obj(){
		for(var i= active_objs.length-1;i>=0;i--){
			if(active_objs[i]['_easyClose']){
				active_objs[i].close();
				break;
			}
		}
	}
	//最后一个有蒙层的对象的zIndex值，无则返回0
	function last_has_mask_zIndex(){
		for(var i= active_objs.length-1;i>=0;i--){
			if(active_objs[i]._easyClose){
				return getCSS(active_objs[i].dom,'zIndex');
			}
		}
		return 0;
	}
	//调整正在显示的对象的位置
	var adapt_delay;
	function adapt_active_obj(){
		clearTimeout(adapt_delay);
		adapt_delay = setTimeout(function(){
			utils.each(active_objs,function(index,item){
				item.adapt();
			});
		},150);
	}
	
	
	/**
	 * 处理对象易于关闭的扩展
	 *   点击自身以外 or 按下esc
	 */
	//检测body的mouseup事件
	bindEvent(private_body,'mouseup',function checkClick(event) {
		var target = event.srcElement || event.target;
		setTimeout(function(){
			while (!utils.hasClass(target,'UI_easyClose')) {
				target = target.parentNode;
				if(!target){
					close_last_easyClose_obj();
					break
				}
			}
		});
	});
	//检测window的keydown事件（esc）
	bindEvent(private_body,'keyup',function checkClick(event) {
		if(event.keyCode == 27){
			close_last_easyClose_obj();
		}
	});
	
	/**
	 * 对象易于关闭方法拓展
	 *   default_value 为默认参数
	 */
	function easyCloseHandle(mark,default_value){
		var me = this;
		if(typeof(mark) == 'boolean' ? mark : default_value){
			utils.addClass(me.dom,'UI_easyClose');
			setTimeout(function(){
				me._easyClose = true;
			});
		}
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
				adapt_active_obj();
				setCSS(private_maskDom,{
					marginTop : private_scrollTop
				});
			};
		}else{
			setCSS(private_maskDom,{
				position : 'fixed',
				top : 0
			});
			rebuild_fn = function(){
				refreshSize();
				adapt_active_obj();
			}
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
			top : Math.ceil(top),
			left : Math.ceil(left)
		}
	}
	//设置dom自适应于页面
	function adaption(dom,param,time){
		var param = param ||{},
			width = outerWidth(dom),
			height = outerHeight(dom),
			top = (private_winH - height)/2 + private_scrollTop,
			left = (private_docW - width)/2,
			newPosition = fix_position(top,left,width,height);
		
		var method = isNum(time) ? animation : setCSS;
		method(dom,{
			top : isNum(param.top) ? param.top : Math.ceil(newPosition.top),
			left : isNum(param.left) ? param.left : Math.ceil(newPosition.left)
		},time);
	}
	//自适应于页面的原型方法
	function ADAPT(){
		adaption(this.dom,null,80);
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
			confirm : btns[0],
			cancel : btns[1]
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
	 * 模糊效果
	 */
	function travelRootElements(callback){
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
			travelRootElements(function(dom){
				utils.addClass(dom,'UI-blur');
			});
		};
		removeBlur = function (){
			travelRootElements(function(dom){
				utils.removeClass(dom,'UI-blur');
			});
		};
	}
	
	/**
	 * 显示蒙层 
	 */
	function showMask(){
		var lastHasMaskZindex = last_has_mask_zIndex();
		setCSS(this.dom,{
			zIndex: lastHasMaskZindex + 2
		});
		if(!this._mask){
			return;
		}
		setCSS(private_maskDom,{
			zIndex: lastHasMaskZindex + 1
		});
		
		if(lastHasMaskZindex == 0){
			//之前蒙层未显示，显示蒙层
			blur && blur();
			utils.fadeIn(private_maskDom,400);
		}
	}
	/**
	 * 关闭蒙层
	 */
	function closeMask(){
		var me = this;
		if( !me._mask){
			return;
		}
		var lastHasMaskZindex = last_has_mask_zIndex();
		setCSS(private_maskDom,{
			zIndex : lastHasMaskZindex - 1
		});
		
		if(lastHasMaskZindex == 0){
			removeBlur && removeBlur();
			utils.fadeOut(private_maskDom,200);
		}
	}
	
	/**
	 * 计算动画所需的方向及目标值
	 *   @returns[0] 所需修改的方向(X/Y)
	 *   @returns[1] 计算后的值
	 */
	function countTranslate(direction,range){
		var prop,
			start;
		switch(direction){
			case 'left':
				prop = 'X';
				start = -range;
				break
			case 'right':
				prop = 'X';
				start = range;
				break
			case 'bottom':
				prop = 'Y';
				start = range;
				break
			default:
				prop = 'Y';
				start = -range;
		}
		return [prop,start];
	}
	
	/**
	 * 开场动画
	 **/
	function openAnimation(fn){
		var me = this;
		var DOM = me.dom;
		var from = me._from;
		var time = 100;
		//向全局记录的对象内添加对象
		active_objs.push(me);
		//显示蒙层（内部判断是否显示）
		showMask.call(me);
		
		//ie系列或无from信息，不显示效果
		if(isIE678 || !from || from == 'none'){
			fn && fn();
			return
		}
		var offset = utils.offset(DOM),
			//动画第一帧css
			cssStart = {},
			//动画需要改变的css
			cssAnim = {};
		//参数是dom对象
		if(from.tagName && from.parentNode){
			var offset_from = utils.offset(from);
			cssStart = {
				top : offset_from.top,
				left : offset_from.left,
				clip: 'rect(0,' + outerWidth(from) + 'px,' + outerHeight(from) + 'px,0)',
				overflow : 'hidden'
			};
			cssAnim = {
				clip: 'rect(0,' + outerWidth(DOM) + 'px,' + outerHeight(DOM) + 'px,0)',
				top : getCSS(DOM,'top'),
				left : getCSS(DOM,'left')
			};
		//参数是字符串
		}else if(typeof(from) == 'string'){
			var countResult = countTranslate(from,40);
			cssStart.transform = 'translate' + countResult[0] + '(' + countResult[1] + 'px)';
			cssAnim.transform = 'translateX(0) translateY(0)';
		}else{
			//参数出错，不显示效果
			fn && fn();
			return
		}
		
		//先隐藏,再显示
		cssStart.opacity = 0;
		cssAnim.opacity = 1;
		
		//动画开始
		setCSS(DOM,cssStart);
		utils.addClass(private_allCnt,'isAnimation');
		animation(DOM,cssAnim,time,'ease-out',function(){
			utils.removeClass(private_allCnt,'isAnimation');
			//恢复动画样式
			setCSS(DOM,{
				clip: 'auto'
			});
			fn && fn();
		});
	}
	
	/**
	 * 处理对象关闭及结束动画
	 */
	function closeAnimation(time_define,fn){
		return function(time){
			var me = this;
			
			//检测自己是否已阵亡
			if(me.dead){
				return;
			}
			//把自己标记为已阵亡
			me.dead = true;
			
			//从全局记录的对象内删除自己；
			remove_active_obj(me);
			
			//触发关闭回调
			me.closeFn && me.closeFn();
			
			// 关闭蒙层（内部判断是否关闭）
			closeMask.call(me);
			
			//执行生成此function的方法提供的回调
			fn && fn.call(me);
			var DOM = me.dom;
			
			utils.addClass(private_allCnt,'isAnimation');
			//删除dom
			function removeDom(){
				utils.removeClass(private_allCnt,'isAnimation');
				utils.removeNode(DOM);
			}
			//ie系列或无from信息，不显示效果
			if(isIE678 || from == 'none'){
				removeDom();
				return
			}
			
			var time = isNum(time) ? time : parseInt(time_define) || 80;
			var from = me._from;
			if(from && from.tagName && from.parentNode){
				//缩放回启动按钮
				var offset =  utils.offset(from);
				setCSS(DOM,{
					overflow : 'hidden',
					clip: 'rect(0,' + outerWidth(DOM) + 'px,' + outerHeight(DOM) + 'px,0)'
				});
				animation(DOM,{
					top : offset.top,
					left : offset.left,
					clip: 'rect(0,' + outerWidth(from) + 'px,' + outerHeight(from) + 'px,0)',
					opacity : 0.3
				},time,function(){
					animation(DOM,{
						opacity : 0
					},50,removeDom);
				});
			}else if(typeof(from) == 'string'){
				var countResult = countTranslate(from,40);			
				//动画开始
				animation(DOM,{
					opacity : 0,
					transform : 'translate' + countResult[0] + '(' + countResult[1] + 'px)'
				},time,removeDom);
			}else{
				//参数出错时，直接删除dom
				removeDom();
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
				move : function(mx,my,l_start,t_start,w_start,h_start){
					var left = mx + l_start;
					var top = my + t_start;
					
					var newSize = fix_position(top,left,w_start,h_start);
					setCSS(me.dom,{
						left : newSize.left,
						top : newSize.top
					});
				}
			});
		}
		
		bindEvent(me.dom,'click','.UI_pop_close',function(){
			me.close();
		});
	
		//插入内容
		me.cntDom.innerHTML = param.html || '';
		
		var this_width = Math.min(param.width || 600,private_docW-20);
		
		//设置宽度，为计算位置尺寸做准备
		setCSS(me.dom,{
			width : this_width
		});
		private_allCnt.appendChild(me.dom);
		
		//校正位置
		adaption(me.dom,param);
		
		//处理是否易于关闭
		easyCloseHandle.call(me,param.easyClose,true);
		
		//开场动画
		openAnimation.call(me);
	}
	//使用close方法
	POP.prototype.close = closeAnimation(150);
	POP.prototype.adapt = ADAPT;

	/**
	 * CONFIRM 
	 */
	function CONFIRM(param){
		var param = param || {};
		var me = this;
		
		var this_html = utils.render(confirm_tpl,{
			text : param.text || 'need text in parameter!'
		});
		me.dom = utils.createDom(this_html)[0];
		me.closeFn = param.closeFn || null;
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
		me._from = param.from || 'top';
		
		add_confirm(me.dom,param,function(){
			me.close();
		});
		private_allCnt.appendChild(me.dom);
		
		adaption(me.dom);
		
		//处理是否易于关闭
		easyCloseHandle.call(me,param.easyClose,true);
		openAnimation.call(me);
	}
	CONFIRM.prototype.close = closeAnimation(200);
	CONFIRM.prototype.adapt = ADAPT;


	/**
	 * ASK 
	 */
	function ASK(text,callback,param){
		var me = this;
		var param = param || {};
		
		var this_html = utils.render(ask_tpl,{
			text : text || 'need text in parameter!'
		});

		me.dom = utils.createDom(this_html)[0];
		me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
		me._from = param.from || 'top';
		me.inputDom = findByClassName(me.dom,'UI_ask_key')[0];
		me.closeFn =  null;
		
		var confirm_html = utils.render(confirmBar_tpl,{
			confirm : '确定',
			cancel : '取消'
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

		private_allCnt.appendChild(me.dom);
		
		adaption(me.dom);
		
		//处理是否易于关闭
		easyCloseHandle.call(me,param.easyClose,true);
		openAnimation.call(me,function(){
			me.inputDom.focus();
		});
		
	}
	ASK.prototype.close = closeAnimation(200);
	ASK.prototype.setValue = function(text){
		this.inputDom.value = text.toString();
	};
	ASK.prototype.adapt = ADAPT;


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
		private_allCnt.appendChild(me.dom);
		adaption(me.dom);
		
		openAnimation.call(me);
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
	PROMPT.prototype.adapt = ADAPT;

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
			width : isNum(param.width) ? Math.min(private_winW,param.width) : private_winW,
			height : isNum(param.height) ? Math.min(private_winH,param.height) : private_winH
		};
		//水平定位
		if(isNum(param.right)){
			cssObj.right = param.right;
		}else if(isNum(param.left)){
			cssObj.left = param.left;
		}else{
			cssObj.left = (private_winW - cssObj.width)/2;
		}
		//垂直定位
		if(isNum(param.bottom)){
			cssObj.top = private_winH - cssObj.height - param.bottom + private_scrollTop;
		}else if(isNum(param.top)){
			cssObj.top = private_scrollTop + param.top;
		}else{
			cssObj.top = private_scrollTop + (private_winH - cssObj.height)/2
		}
		setCSS(me.dom,cssObj);
		private_allCnt.appendChild(me.dom);
		
		//处理是否易于关闭
		easyCloseHandle.call(me,param.easyClose,true);
		openAnimation.call(me,function(){
			setCSS(private_body,{
				overflowY : 'hidden'
			});
		});
		//insert html
		me.cntDom.innerHTML = param.html || '';
	}
	//使用close方法
	COVER.prototype.close = closeAnimation(400,function(){
		setCSS(this.cntDom,{
			overflowY : 'hidden'
		});
		setCSS(private_body,{
			overflowY : this._bodyOverflowY
		});
	});
	COVER.prototype.adapt = ADAPT;
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
			list : nameList,
			title : param.title || null,
			intro : param.intro || null
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
		
		if(private_docW < 640 && !isIE678){
			//手机版
			me._from = 'bottom';
			private_allCnt.appendChild(me.dom);
		}else{
			var cssObj = {
				top : param.top || 100,
				left : param.left || 100,
				width : param.width || 200
			};
			private_allCnt.appendChild(me.dom);
			
			setCSS(me.dom,cssObj);
			var newSize = fix_position(cssObj.top,cssObj.left,cssObj.width,outerHeight(me.dom));
			setCSS(me.dom,{
				left : newSize.left,
				top : newSize.top
			});
		}
		easyCloseHandle.call(me,param.easyClose,true);
		openAnimation.call(me);
		
	}
	SELECT.prototype.close = closeAnimation(200);
	SELECT.prototype.adapt = ADAPT;
	/**
	 *  抛出对外接口
	 */
	return {
		pop : function(){
			return new POP(arguments[0]);
		},
		config : {
			gap : function(name,value){
				//name符合top/right/bottom/left,且value值为数字类型（兼容字符类型）
				if(name && typeof(private_CONFIG.gap[name]) == 'number' && isNum(value)){
					private_CONFIG.gap[name] = parseInt(value);
				}
			},
			zIndex : function(num){
				var num = parseInt(num);
				if(num > 0){
					private_CONFIG.zIndex = num;
					setCSS(private_allCnt,{
						zIndex : num
					});
				}
			}
		},
		confirm : function(){
			return new CONFIRM(arguments[0]);
		},
		ask : function(text,callback,param){
			return new ASK(text,callback,param);
		},
		prompt : function(txt,time,param){
			return new PROMPT(txt,time,param);
		},
		cover : function(){
			return new COVER(arguments[0]);
		},
		select : function(){
			return new SELECT(arguments[0],arguments[1]);
		}
	};
},requires('utils.js'));
