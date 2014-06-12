/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2014-6-12 15:12
 * 
 * Function depends on
 *		JQUERY
 * 
 * 
 **/

(function(global,doc,$,factoryFn){
	//初始化工具
	var factory = factoryFn(global,doc,$);
	
	//提供window.UI的接口
	global.UI = global.UI || {};
	global.UI.ask = factory.ask;
	global.UI.pop = factory.pop;
	global.UI.miniChat = factory.miniChat;
	global.UI.confirm = factory.confirm;
	global.UI.prompt = factory.prompt;
	global.UI.plane = factory.plane;
	global.UI.cover = factory.cover;
	global.UI.select = factory.select;
	global.UI.drag = factory.drag;
	
	//提供CommonJS规范的接口
	global.define && define(function(){
		return factory;
	});
})(this,document,$,function(window,document,$){
	var allCnt = ['<div class="UI_lawyer">',
		'<div class="UI_mask"></div>',
		'<div class="UI_main_cnt"></div>',
		'<div class="UI_fixedScreenTop_cnt"></div>',
		'<div class="UI_fixedScreenBottom_cnt"></div>',
	'</div>'].join('');
	var pop_tpl = ['<div class="UI_pop">',
		'<div class="UI_pop_cpt"></div>',
		'<div class="UI_pop_cnt"></div>',
		'<a href="javascript:void(0)" class="UI_pop_close" title="\u5173\u95ED">×</a>',
	'</div>'].join('');

	var miniChat_tpl = ['<div class="UI_miniChatSlideCnt"><div class="UI_miniChat">',
		'<div class="UI_miniChat_text">{text}</div>',
	'</div></div>'].join('');

	var confirm_tpl = ['<div class="UI_confirm">',
		'<div class="UI_confirm_text">{text}</div>',
	'</div>'].join('');

	var ask_tpl = ['<div class="UI_ask">',
		'<div class="UI_ask_text">{text}</div>',
		'<input type="text" name="UI_ask_key"/>',
	'</div>'].join('');

	var confirmBar_tpl = ['<div class="UI_pop_confirm">',
		'<a href="javascript:void(0)" class="UI_pop_confirm_ok">{confirm}</a>',
		'<a href="javascript:void(0)" class="UI_pop_confirm_cancel">{cancel}</a>',
	'</div>'].join('');

	var plane_tpl = ['<div class="UI_plane"></div>'].join('');
	var prompt_tpl = ['<div class="UI_prompt">',
		'<div class="UI_cnt"></div>',
	'</div>'].join('');

	var cover_tpl = ['<div class="UI_cover">',
		'<div class="UI_coverCnt"></div>',
		'<a href="javascript:void(0)" class="UI_coverClose">〉</a>',
	'</div>'].join('');
	
	var select_tpl = ['<div class="UI_select">',
		'<div class="UI_selectCnt">{list}</div>',
		'<div class="UI_selectCancel"><a href="javascript:void(0)" data-index="-1">取消</a></div>',
	'</div>'].join('');
	
	var popCSS = ['<style type="text/css" data-module="UI-pop-prompt-plane">',
		//基础框架
		'.UI_lawyer{position:absolute;top:0px;left:0px;z-index:4999;width:100%;height:0px;overflow:visible;font-family:"Microsoft Yahei"}',
		'.UI_lawyer a,.UI_lawyer a:hover{text-decoration:none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;}',
		'.UI_mask{position:absolute;top:0px;left:0px;width:100%;background-color:#000;display:none;opacity:0.2}',
		'.UI_main_cnt{width:0px;height:0px;overflow:visible;}',
		'.UI_fixedScreenTop_cnt{position:absolute;z-index:4999;top:0px;left:0px;width:100%;height:0px;overflow:visible;}',
		'.UI_fixedScreenBottom_cnt{position:absolute;z-index:4999;left:0px;width:100%;height:0px;overflow:visible;}',
		//各模块样式
		'.UI_pop{width:200px;_border:1px solid #eee;position:absolute;top:400px;left:300px;',
			'background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_pop_cpt{position:relative;height:40px;line-height:40px;margin-right:41px;overflow:hidden;border-bottom:1px solid #ebebeb;background:#f6f6f6;',
			'color:#333;font-size:18px;text-indent:15px;cursor: default;}',
		'.UI_pop_cnt{position:relative;min-height:100px;overflow:auto;width:100%;}',
		'.UI_pop_close{display:block;position:absolute;top:0px;right:0px;width:40px;height:40px;text-align:center;line-height:40px;color:#ddd;font-family:"Simsun";font-size:40px;background:#fafafa;border:1px solid #ebebeb;border-width:0px 0px 1px 1px;text-decoration:none;}',
		'.UI_pop_close:hover{background-color:#eee;border-left-color:#ddd;text-decoration:none;}',
		'.UI_pop_close:active{background-color:#ddd;border-left-color:#ccc;color:#ccc;}',
		'.UI_confirm{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333;}',
		'.UI_ask{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_ask_text{padding:30px 10px 10px;line-height:26px;text-align:center;font-size:20px;color:#333;}',
		'.UI_ask input{display:block;margin:0px auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-size;width:90%;}',
		'.UI_miniChatSlideCnt{width:220px;height:0px;overflow:hidden;position:absolute;border-radius:4px;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_miniChat{position:absolute;left:0px;bottom:0px;width:100%;_border:1px solid #eee;background:#fff;overflow:hidden;}',
		'.UI_miniChat_text{padding:20px 10px 10px;box-sizing:content-box;line-height:24px;text-align:center;font-size:14px;color:#333;}',
		'.UI_miniChat .UI_pop_confirm a{height:26px;line-height:26px;}',
		'.UI_pop_confirm{padding:10px 0px 15px 30px;box-sizing:content-box;text-align:center;}',
		'.UI_pop_confirm a{display:inline-block;height:30px;padding:0px 15px;box-sizing:content-box;border-radius:3px;font-size:14px;line-height:30px;background:#38b;color:#fff;margin-right:30px;}',
		'.UI_pop_confirm a:hover{text-decoration: none;background:#49c;}',
		'.UI_pop_confirm a:active{text-decoration: none;background:#27a}',
		'.UI_plane{width:200px;position:absolute;top:400px;left:300px;}',
		'.UI_prompt{width:240px;position:absolute;padding:30px 10px;box-sizing:content-box;background:#fff;_border:1px solid #fafafa;border-radius:4px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);}',
		'.UI_cnt{font-size:18px;color:#222;text-align:center;}',
		'.UI_cover{position:absolute;top:0px;left:0px;width:100%;height:100px;}',
		'.UI_coverCnt{position:relative;width:100%;height:100%;background:#fff;}',
		'.UI_coverClose{display:block;position:absolute;top:50%;left:0px;width:20px;height:60px;padding-left:5px;text-align:center;line-height:60px;color:#ddd;font-family:"Simsun";font-size:30px;background:#555;}',
		'.UI_coverClose:hover{background-color:#333;color:#fff;text-decoration:none;}',
		
		'.UI_select{position:absolute;width:100%;bottom:0px;padding-bottom:10px;}',
		'.UI_select a{display:block;height:40px;line-height:40px;text-align:center;color:#09f;font-size:16px;background:#fff;}',
		'.UI_selectCnt{margin:0px 10px 10px;border-radius:8px;overflow:hidden;}',
		'.UI_selectCnt a{border-top:1px solid #eee;margin-top:-1px;}',
		'.UI_selectCancel{margin:0px 10px;border-radius:8px;overflow:hidden;}',
		
		'.UI_fixedScreenBottom_cnt .UI_confirm{width:100%;width:100%;left:0px;bottom:0;border-radius:0px;box-shadow:0px 0px 5px rgba(0,0,0,0.8);}',
		'.UI_fixedScreenBottom_cnt .UI_confirm_text{padding:50px 10px;font-size:18px}',
		'.UI_fixedScreenBottom_cnt .UI_confirm .UI_pop_confirm{width:100%;padding:10px 0px 30px}',
		'.UI_fixedScreenBottom_cnt .UI_confirm a{display:block;height:40px;line-height:40px;border-radius:22px;margin:0px 20px;font-size:16px}',
		'.UI_fixedScreenBottom_cnt .UI_confirm  a.UI_pop_confirm_ok{margin-bottom:15px;}',
	'</style>'].join('');
	var isIE67 = false;
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true; 
		}
	}

	/**
	 * 定义私有变量
	 * 
	 **/ 
	var private_allCnt = $(allCnt),
		 private_body = $('html,body'),
		 private_maskDom = private_allCnt.find('.UI_mask'),
		 private_mainDom = private_allCnt.find('.UI_main_cnt'),
		 private_isSupportTouch = "ontouchend" in document ? true : false,
		 private_fixedScreenTopDom = private_allCnt.find('.UI_fixedScreenTop_cnt'),
		 private_fixedScreenBottomDom = private_allCnt.find('.UI_fixedScreenBottom_cnt'),
		 private_win = $(window),
		 private_winW,
		 private_winH,
		 private_doc = $(document),
		 private_docH,
		 private_scrollTop,
		 private_maskCount = 0;

	var private_CONFIG = {
		'gap' : {
			'top' : 0,
			'left' : 0,
			'bottom' : 0,
			'right' : 0
		},
		'zIndex' : 499
	};

	//重新计算窗口尺寸
	function countSize(){
		private_winW = document.body.clientWidth;
		private_scrollTop = private_win.scrollTop();
		private_winH = window.innerHeight;
		private_docH = private_doc.height();
	}
	$('head').append(popCSS);
	$('body').append(private_allCnt);

	//更新窗口尺寸
	countSize();
	$(function(){
		countSize();
		setTimeout(countSize,500);
	});
	/**
	 *	fix Prompt Mask position & size 
	 */ 
	if(isIE67){
		private_maskDom.css({
			'height' : private_docH
		});
		private_fixedScreenTopDom.css({
			'top' : private_scrollTop
		});
		private_fixedScreenBottomDom.css({
			'top' : private_scrollTop + private_winH
		});
		private_win.on('resize scroll',function(){
			//更新窗口尺寸
			countSize();
			private_fixedScreenTopDom.animate({
				'top' : private_scrollTop
			},100);
			private_fixedScreenBottomDom.animate({
				'top' : private_scrollTop + private_winH
			},100);
			private_maskDom.css({
				'top' : private_scrollTop,
				'height' : private_winH
			});
		});
	}else{
		private_fixedScreenTopDom.css({
			'position' : 'fixed',
			'top' : 0
		});
		private_fixedScreenBottomDom.css({
			'position' : 'fixed',
			'bottom' : 0
		});
		private_maskDom.css({
			'height' : private_docH
		});
		private_win.on('resize scroll',function(){
			//更新窗口尺寸
			countSize();
			private_maskDom.css({
				'height' : private_docH
			});
		});
	}
	//通用拖动方法
	function drag(handle_dom,dom,param){
		var param = param || {};
		var moving = param['move'] || null;
		var start = param['start'] || null;
		var end = param['end'] || null;
		var dragMask = $('<div style="width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:100000;cursor:default;"></div>');

		var dx, dy,l_start,t_start,w_start,h_start;
		handle_dom.mousedown(function(e){
			if(e.button == 0){
				down(e);
			}
		});
		function down(e){
			//更新窗口尺寸
			countSize();
//			e.preventDefault();
//			e.stopPropagation();
			dx = e.pageX;
			dy = e.pageY;
			l_start = parseInt(dom.css('left'));
			t_start = parseInt(dom.css('top'));
			w_start = parseInt(dom.outerWidth());
			h_start = parseInt(dom.outerHeight());
			private_doc.mousemove(move).mouseup(up);
			dragMask.css({
				'width' : private_winW,
				'height' : private_winH,
				'top' : 0,
				'left' : 0,
				'cursor' : handle_dom.css('cursor')
			});
			private_fixedScreenTopDom.append(dragMask);
			start&&start();
		}
		function move(e){
			e.preventDefault();
			e.stopPropagation();
			//remove selection
		//	window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
			moving&&moving(e.pageX-dx,e.pageY-dy,l_start,t_start,w_start,h_start);
		}
		function up(e) {
			dragMask.remove();
			private_doc.unbind("mousemove", move).unbind("mouseup", up);
			end&&end();
		}
	}
	//通用限制位置区域的方法
	function fix_position(top,left,width,height){
		var gap = private_CONFIG.gap;
		if(top<private_scrollTop + gap.top){
			//Beyond the screen(top)
			top = private_scrollTop  + gap.top;
		}else if(top + height - private_scrollTop > private_winH - gap.bottom) {
			//Beyond the screen(bottom)
			if(height > private_winH - gap.top - gap.bottom){
				//Is higher than the screen
				top = private_scrollTop + gap.top;
			}else{
				//Is shorter than the screen
				top = private_scrollTop + private_winH - height - gap.bottom;
			}
		}
		if(left < gap.left){
			left =  gap.left;
		}else if(left + width > private_winW - gap.right){
			left = private_winW - width - gap.right;
		}
		return {
			'top' : top,
			'left' : left
		}
	}
	//计算自适应页面位置的方法
	function adaption(width,height){
		var top = (private_winH - height)/2 + private_scrollTop;
		var left = (private_winW - width)/2;
		var newPosition = fix_position(top,left,width,height);

		var gap = private_CONFIG.gap;
		var clientTop = (private_winH - height)/2;
		if(clientTop<gap.top){
			clientTop = gap.top;
		}
		return {
			'top' : newPosition.top,
			'left' : newPosition.left,
			'clientTop' : clientTop,
			'clientLeft' : newPosition.left
		}
	}
	//增加确认方法
	function add_confirm(dom,param,close){
		var callback = null;
		var cancel = null;
		var btns = ['\u786E\u8BA4','\u53D6\u6D88'];
		if(typeof(param) == "function"){
			callback = param;
		}else if(typeof(param) == "object"){
			if(param['btns']){
				btns[0] = param['btns'][0];
				btns[1] = param['btns'][1];
			}
			if(typeof(param['callback']) == "function"){
				callback = param['callback'];
			}
			if(typeof(param['cancel']) == "function"){
				cancel = param['cancel'];
			}
		}
		var this_html = confirmBar_tpl.replace(/{(\w+)}/g,function(){
			var key = arguments[1];
			if(key == 'confirm'){
				return btns[0]
			}else if(key == 'cancel'){
				return btns[1]
			}
		});
		dom.append(this_html);
		dom.on('click','.UI_pop_confirm_ok',function(){
			if(callback){
				//根据执行结果判断是否要关闭弹框
				var result = callback();
				if(result != false){
					close();
				}
			}else{
				close();
			}
		}).on('click','.UI_pop_confirm_cancel',function(){
			if(cancel){
				//根据执行结果判断是否要关闭弹框
				var result = cancel();
				if(result != false){
					close();
				}
			}else{
				close();
			}
		});
	}
	
	/**
	 * 显示蒙层 
	 */
	function showMask(){
		private_maskCount++
		if(private_maskCount==1){
			private_maskDom.show();
		}
	}
	/**
	 * 公用关闭方法
	 *  
	 */
	function CLOSEMETHOD(effect,time){
		this.closeFn && this.closeFn();

		if(!effect){
			this.dom.remove();
		}else{
			var method = 'fadeOut';
			var time = time ? parseInt(time) : 80;
			if(effect == 'fade'){
				method = 'fadeOut'
			}else if(effect == 'slide'){
				method = 'slideUp'
			}
			this.dom[method](time,function(){
				$(this).remove();
			});
		}

		if(this._mask){
			private_maskCount--
			if(private_maskCount==0){
				private_maskDom.fadeOut(80);
			}
		}
	}
	/**
	 * 弹框
	 * pop 
	 */
	function POP(param){
		var param = param || {};
		var this_pop = this;
		
		this.dom = $(pop_tpl);
		this.cntDom = this.dom.find('.UI_pop_cnt');
		this.closeFn = param['closeFn'] || null;
		this._mask = param['mask'] || false;

		var this_html = param['html'] || '';
		var this_width = param['width'] || 240;
		var this_height = param['height'] ? parseInt(param['height']) : null;


		//预定高度时
		if(this_height){
			this.cntDom.css({
				'height' : this_height-41
			});
		}

		//当有确认参数时
		if(param['confirm']){
			add_confirm(this.dom,param['confirm'],function(){
				this_pop.close();
			});
		}
		//处理title参数
		if(param['title'] == false){
			this.dom.find('.UI_pop_cpt').remove();
		}else{
			var title = param['title'] || '\u8BF7\u8F93\u5165\u6807\u9898';
			this.dom.find('.UI_pop_cpt').html(title);
			//can drag is pop
			UI.drag(this.dom.find('.UI_pop_cpt'),this.dom,{
				'move' : function(dx,dy,l_start,t_start,w_start,h_start){
					var top = dy + t_start;
					var left = dx + l_start;
					var newSize = fix_position(top,left,w_start,h_start);
					this_pop.dom.css({
						'left' : newSize.left,
						'top' : newSize.top
					});
				}
			});
		}


		//insert html
		this.cntDom.prepend(this_html);
		
		private_mainDom.append(this.dom);
		
		//fix position get size
		var fixSize = adaption(this_width,(this_height?this_height:this.dom.height()));
		var top = typeof(param['top']) == 'number' ? param['top'] : fixSize.top;
		var left = typeof(param['left']) == 'number' ? param['left'] : fixSize.left;
		
		// create pop
		this.dom.css({
			'width' : this_width,
			'left' : left,
			'top' : top
		}).on('click','.UI_pop_close',function(){
			this_pop.close();
		});
		if(this._mask){
			showMask();
		}
		
	}
	//使用close方法
	POP.prototype['close'] = CLOSEMETHOD;
	POP.prototype['adapt'] = function(){
		var offset = this.dom.offset();
		var width = this.dom.width();
		var height = this.dom.height();

		var fixSize = adaption(width,height);
	//	console.log(offset,fixSize,'-----------');
		this.dom.animate({
			'top' : fixSize.top,
			'left' : fixSize.left
		},100);
	};

	/**
	 * CONFIRM 
	 */
	function CONFIRM(param){
		var param = param || {};
		var this_pop = this;

		var this_text = param['text'] || '\u8BF7\u8F93\u5165\u786E\u8BA4\u4FE1\u606F！';
		var callback = param['callback'] || null;
		var this_html = confirm_tpl.replace(/{text}/,this_text);
		this._mask = true;
		this.dom = $(this_html);
		this.closeFn = param['closeFn'] || null;

		//显示蒙层
		showMask();
		if(private_winW > 460){
			add_confirm(this.dom,param,function(){
				this_pop.close();
			});
			var newPosition = adaption(300,160);
			// create pop
			this.dom.css({
				'width' : 300,
				'left' : newPosition.clientLeft,
				'top' : newPosition.clientTop
			});
			private_fixedScreenTopDom.append(this.dom);
		}else{
			add_confirm(this.dom,param,function(){
				this_pop.close('slide',100);
			});
			this.dom.css('bottom',-500);
			// create pop
			private_fixedScreenBottomDom.append(this.dom);
			this.dom.animate({
				'bottom' : 0
			},200);
		}
	}
	CONFIRM.prototype['close'] = CLOSEMETHOD


	/**
	 * ASK 
	 */
	function ASK(text,callback){
		var this_pop = this;

		var this_text = text || '\u8BF7\u8F93\u5165\u786E\u8BA4\u4FE1\u606F！';
		var this_html = ask_tpl.replace(/{text}/,this_text);

		this.dom = $(this_html);
		this.closeFn =  null;
		this.callback = callback || null;

		var this_html = confirmBar_tpl.replace(/{(\w+)}/g,function(a,key){
			if(key == 'confirm'){
				return '确定';
			}else if(key == 'cancel'){
				return '取消';
			}
		});
		this.dom.append(this_html);
		this.dom.on('click','.UI_pop_confirm_ok',function(){
			var value = this_pop.dom.find('input').val();
			if(this_pop.callback){
				//根据执行结果判断是否要关闭弹框
				var result = this_pop.callback(value);
				if(result != false){
					this_pop.close();
				}
			}else{
				this_pop.close();
			}
		}).on('click','.UI_pop_confirm_cancel',function(){
			this_pop.close();
		});

		var newPosition = adaption(300,160);
		// create pop
		this.dom.css({
			'width' : 300,
			'left' : newPosition.clientLeft,
			'top' : newPosition.clientTop
		});

		private_fixedScreenTopDom.append(this.dom);
	}
	ASK.prototype['close'] = CLOSEMETHOD;
	ASK.prototype['setValue'] = function(text){
		var text = text ? text.toString() : '';
		this.dom.find('input').val(text);
	};


	/**
	 * prompt
	 * 
	 **/
	function prompt(txt,time){
		var this_prompt = this;
		var txt = txt || '\u8BF7\u8F93\u5165\u5185\u5BB9';
		this.dom = $(prompt_tpl);		

		this.tips(txt);


		var newPosition = adaption(260,100);
		// create pop

		this.dom.css({
			'left' : newPosition.clientLeft,
			'top' : newPosition.clientTop
		});
		//console.log(private_winH,12);
		private_fixedScreenTopDom.append(this.dom);
		if(time != 0){
			this_prompt.close(time);
		}
	}
	prompt.prototype = {
		'tips' : function(txt){
			if(txt){
				this.dom.find('.UI_cnt').html(txt);
			}
		},
		'close' : function(time){
			var delay = time ? parseInt(time) : 1300 ;
			var this_prompt = this;

			setTimeout(function(){
				this_prompt.dom.fadeOut(200,function(){
					this_prompt.dom.remove();
				});
			},delay);
		}
	};

	/**
	 *	PLANE 
	 */
	//the active plane
	private_activePlane = null;
	/**
	 * 检查class在不在多个class中 
	 */
	function hasClass(classAll,classSingle){
		var classAll= classAll || '';
		var classArray = classAll.split(/\s/g);
		for(var i=0,total=classArray.length;i<total;i++){
			if(classArray[i] == classSingle){
				return true;
			}
		}
	}
	/**
	 * 简单的事件委托模型 
	 */
	function checkClick(event) {
		var target = event.target;
		while (!hasClass(target.className,'UI_plane')) {
			target = target.parentNode;
			if(!target){
		//		console.log('not target')
				//close the active plane
				private_activePlane&&private_activePlane.close();
				break
			}
		}
	//	console.log('target',target)
	}
	
	if(private_isSupportTouch){
		//移动端使用touch
		var doc = private_doc[0];
		doc.addEventListener('touchstart',checkClick);
		doc.addEventListener('MSPointerDown',checkClick);
		doc.addEventListener('pointerdown',checkClick);
	}else{
		//PC鼠标事件
		private_doc.on('mousedown',checkClick);
	}


	function PLANE(param){
		//如果有已展开的PLANE，干掉他
		private_activePlane&&private_activePlane.close();
		private_activePlane = this;

		var param = param || {};
		var this_plane = this;		

		var this_html = param['html'] || '';
		this.closeFn = param['closeFn'] || null;

		this.dom = $(plane_tpl);

		//insert html
		this.dom.html(this_html);
		this.dom.css({
			'width' : param['width'] || 240,
			'height' :param['height'] || null,
			'top' : param['top'] || 300,
			'left' : param['left'] || 800
		});
		private_mainDom.append(this.dom);
	}
	PLANE.prototype['close'] = CLOSEMETHOD;

	/**
	 *	miniChat 
	 */

	function miniChat(param){
		var param = param || {};
		var this_chat = this;

		this.text = param['text'] || '\u8BF7\u8F93\u5165\u6807\u9898';
		this.closeFn = param['closeFn'] || null;
		var this_tpl = miniChat_tpl.replace('{text}',this.text);
		this.dom = $(this_tpl);
		//当有确认参数时
		add_confirm(this.dom.find('.UI_miniChat'),param,function(){
			this_chat.close();
		});

		var top = typeof(param['top']) == 'number' ? param['top'] : 300;
		var left = typeof(param['left']) == 'number' ? param['left'] : 300;

		// create pop
		this.dom.css({
			'left' : left,
			'top' : top
		});
		private_mainDom.append(this.dom);
		var height = this.dom.find('.UI_miniChat').height();
		this.dom.animate({
			'height' : height
		},200);
	}
	miniChat.prototype['close'] = CLOSEMETHOD;



	/***
	 * 全屏弹框
	 * COVER 
	 */
	function COVER(param){
		var param = param || {};
		var this_cover = this;
		this.dom = $(cover_tpl);
		this.cntDom = this.dom.find('.UI_coverCnt');
		this.closeDom = this.dom.find('.UI_coverClose');
		this.closeFn = param['closeFn'] || null;

		var this_html = param['html'] || '';
		//insert html
		this.cntDom.prepend(this_html);

		this.dom.on('click','.UI_coverClose',function(){
			this_cover.close();
		});

		this.closeDom.hide();
		// create pop
		this.dom.css({
		 	'height' : private_winH
		});
		this.cntDom.css({
			'top' : 0,
			'left' : private_winW
		}).animate({
			'left' : 0
		},200,function(){
			this_cover.closeDom.fadeIn(100);
		});
		private_fixedScreenTopDom.append(this.dom);
	}
	//使用close方法
	COVER.prototype['close'] = function(){
		var dom_all = this.dom;
		this.closeDom.fadeOut(100);
		this.cntDom.animate({
			'left' : private_winW
		},400, function(){
			dom_all.remove();
		});
	};

	/**
	 * 选择功能
	 */
	function SELECT(list){
		var this_sel = this;
		var html ='';
		var fns = [];
		for(var i=0,total=list.length;i<total;i++){
			html += '<a href="javascript:void(0)" data-index="' + i + '">' + list[i][0] + '</a>';
			fns.push(list[i][1]);
		}
		var this_html = select_tpl.replace(/\{list\}/,html);
		
		this.dom = $(this_html);
		this._mask = true;
		
		
		//显示蒙层
		showMask();
		this.dom.css('bottom',-500);
		private_fixedScreenBottomDom.append(this.dom);
		this.dom.animate({
			'bottom' : 0
		},200);	
		
		this.dom.on('click','a',function(){
			var txt = $(this).html();
			var index = $(this).attr('data-index');
			if(index != '-1'){
				fns[index] && fns[index]();
			}
			this_sel.close('slide',200);
		});
	}
	SELECT.prototype['close'] = CLOSEMETHOD;
	/**
	 *  抛出对外接口
	 */
	return {
		'pop' : function(){
			return new POP(arguments[0]);
		},
		'config' : {
			'gap' : function(name,value){
				if(name && name.match(/(top|right|bottom|left)/)){
					if(parseInt(value)){
						private_CONFIG.gap[name] = value;
					}
				}
			},
			'zIndex' : function(num){
				var num = parseInt(num);
				if(num > 0){
					private_CONFIG.zIndex = num;
					private_allCnt.css('zIndex',num);
					private_fixedScreenBottomDom('zIndex',num);
					private_fixedScreenTopDom('zIndex',num);
				}
			}
		},
		'miniChat' : function(){
			return new miniChat(arguments[0]);
		},
		'confirm' : function(){
			return new CONFIRM(arguments[0]);
		},
		'ask' : function(text,callback){
			return new ASK(text,callback);
		},
		'prompt' : function(txt,time){
			return new prompt(txt,time);
		},
		'plane' : function(){
			return new PLANE(arguments[0]);
		},
		'cover' : function(){
			return new COVER(arguments[0]);
		},
		'select' : function(){
			return new SELECT(arguments[0]);
		},
		'drag' : drag
	};
});