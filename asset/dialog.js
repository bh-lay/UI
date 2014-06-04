/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2014-6-4 10:08
 * 
 * Function depends on
 *		JQUERY
 * 
 * 
 **/

window.UI = window.UI || {};
(function(exports){
	var allCnt = ['<div class="pop_lawyer">',
		'<div class="pop_mask"></div>',
		'<div class="pop_main_cnt"></div>',
		'<div class="pop_fixedScreen_cnt"></div>',
	'</div>'].join('');
	var pop_tpl = ['<div class="pro_pop">',
		'<div class="pro_pop_cpt"></div>',
		'<div class="pro_pop_cnt"></div>',
		'<a href="javascript:void(0)" class="pro_pop_close" title="\u5173\u95ED">×</a>',
	'</div>'].join('');

	var miniChat_tpl = ['<div class="pro_miniChatSlideCnt"><div class="pro_miniChat">',
		'<div class="pro_miniChat_text">{text}</div>',
	'</div></div>'].join('');

	var confirm_tpl = ['<div class="pro_confirm">',
		'<div class="pro_confirm_text">{text}</div>',
	'</div>'].join('');

	var ask_tpl = ['<div class="pro_ask">',
		'<div class="pro_ask_text">{text}</div>',
		'<input type="text" name="pro_ask_key"/>',
	'</div>'].join('');

	var confirmBar_tpl = ['<div class="pro_pop_confirm">',
		'<a href="javascript:void(0)" class="pro_pop_confirm_ok">{confirm}</a>',
		'<a href="javascript:void(0)" class="pro_pop_confirm_cancel">{cancel}</a>',
	'</div>'].join('');

	var plane_tpl = ['<div class="pro_plane"></div>'].join('');
	var prompt_tpl = ['<div class="pro_prompt">',
		'<div class="pro_cnt"></div>',
	'</div>'].join('');

	var cover_tpl = ['<div class="pro_cover">',
		'<div class="pro_coverCnt"></div>',
		'<a href="javascript:void(0)" class="pro_coverClose">〉</a>',
	'</div>'].join('');

	var popCSS = ['<style type="text/css" data-module="UI-pop-prompt-plane">',
		//基础框架
		'.pop_lawyer{position:absolute;top:0px;left:0px;z-index:4999;width:100%;height:0px;overflow:visible;font-family:"Microsoft Yahei"}',
		'.pop_lawyer a{text-decoration:none}',
		'.pop_mask{position:absolute;top:0px;left:0px;width:100%;background:#000;display:none;opacity:0.2}',
		'.pop_main_cnt{width:0px;height:0px;overflow:visible;}',
		'.pop_fixedScreen_cnt{position:absolute;top:0px;left:0px;width:100%;height:0px;overflow:visible;}',
		//各模块样式
		'.pro_pop{width:200px;_border:1px solid #eee;position:absolute;top:400px;left:300px;',
			'background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.pro_pop_cpt{position:relative;height:40px;line-height:40px;margin-right:41px;overflow:hidden;border-bottom:1px solid #ebebeb;background:#f6f6f6;',
			'color:#333;font-size:18px;text-indent:15px;cursor: default;}',
		'.pro_pop_cnt{position:relative;min-height:100px;overflow:auto;width:100%;}',
		'.pro_pop_close{display:block;position:absolute;top:0px;right:0px;width:40px;height:40px;text-align:center;line-height:40px;color:#ddd;font-family:"Simsun";font-size:40px;background:#fafafa;border:1px solid #ebebeb;border-width:0px 0px 1px 1px;text-decoration:none;}',
		'.pro_pop_close:hover{background-color:#eee;border-left-color:#ddd;text-decoration:none;}',
		'.pro_pop_close:active{background-color:#ddd;border-left-color:#ccc;color:#ccc;}',
		'.pro_confirm{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.pro_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333;}',
		'.pro_ask{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.pro_ask_text{padding:30px 10px 10px;line-height:26px;text-align:center;font-size:20px;color:#333;}',
		'.pro_ask input{display:block;margin:0px auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-size;width:90%;}',
		'.pro_miniChatSlideCnt{width:220px;height:0px;overflow:hidden;position:absolute;border-radius:4px;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.pro_miniChat{position:absolute;left:0px;bottom:0px;width:100%;_border:1px solid #eee;background:#fff;overflow:hidden;}',
		'.pro_miniChat_text{padding:20px 10px 10px;box-sizing:content-box;line-height:24px;text-align:center;font-size:14px;color:#333;}',
		'.pro_miniChat .pro_pop_confirm a{height:26px;line-height:26px;}',
		'.pro_pop_confirm{padding:10px 0px 15px 30px;box-sizing:content-box;text-align:center;}',
		'.pro_pop_confirm a{display:inline-block;height:30px;padding:0px 15px;box-sizing:content-box;border-radius:3px;font-size:14px;line-height:30px;background:#38b;color:#fff;margin-right:30px;}',
		'.pro_pop_confirm a:hover{text-decoration: none;background:#49c;}',
		'.pro_pop_confirm a:active{text-decoration: none;background:#27a}',
		'.pro_plane{width:200px;position:absolute;top:400px;left:300px;}',
		'.pro_prompt{width:240px;position:absolute;padding:30px 10px;box-sizing:content-box;background:#fff;_border:1px solid #fafafa;border-radius:4px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);}',
		'.pro_cnt{font-size:18px;color:#222;text-align:center;}',
		'.pro_cover{position:absolute;top:0px;left:0px;width:100%;height:100px;}',
		'.pro_coverCnt{position:relative;width:100%;height:100%;background:#fff;}',
		'.pro_coverClose{display:block;position:absolute;top:50%;left:0px;width:20px;height:60px;padding-left:5px;text-align:center;line-height:60px;color:#ddd;font-family:"Simsun";font-size:30px;background:#555;}',
		'.pro_coverClose:hover{background-color:#333;color:#fff;text-decoration:none;}',
	'</style>'].join('');
	var isIE67 = false;
	if(navigator.appName == "Microsoft Internet Explorer"){
		var version = navigator.appVersion.split(";")[1].replace(/[ ]/g,"");
		if(version == "MSIE6.0" || version == "MSIE7.0"){
			isIE67 = true; 
		}
	}
	var DOM = $(allCnt);

	/**
	 * 
	 * define private variables
	 * 
	 **/ 
	var private_body = $('html,body'),
		 private_maskDom = DOM.find('.pop_mask'),
		 private_mainDom = DOM.find('.pop_main_cnt'),
		 private_isSupportTouch = "ontouchend" in document ? true : false,
		 private_fixedScreenDom = DOM.find('.pop_fixedScreen_cnt'),
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
	$('body').append(DOM);

	//更新窗口尺寸
	$(function(){
		countSize();
		setTimeout(countSize,500);
	});
	/**
	 *	fix Prompt Mask position & size 
	 */ 
	if(isIE67){
		private_maskDom.css({
			'position' : 'absolute',
			'height' : private_winH,
			'top' : 0
		});
		private_win.on('resize scroll',function(){
			//更新窗口尺寸
			countSize();
			private_fixedScreenDom.animate({
				'top' : private_scrollTop
			},100);
			private_maskDom.css({
				'top' : private_scrollTop,
				'height' : private_winH
			});
		});
	}else{
		private_fixedScreenDom.css({
			'position' : 'fixed',
			'top' : 0
		});
		private_maskDom.css({
			'position' : 'fixed',
			'height' : private_winH,
			'top' : 0
		});
		private_win.on('resize scroll',function(){
			//更新窗口尺寸
			countSize();
			private_maskDom.css({
				'height' : private_winH
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
			private_fixedScreenDom.append(dragMask);
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
		dom.on('click','.pro_pop_confirm_ok',function(){
			if(callback){
				//根据执行结果判断是否要关闭弹框
				var result = callback();
				if(result != false){
					close();
				}
			}else{
				close();
			}
		}).on('click','.pro_pop_confirm_cancel',function(){
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
	/***
	 * 弹框
	 * pop 
	 */
	function POP(param){
		var param = param || {};
		var this_pop = this;
		
		this.dom = $(pop_tpl);
		this.cntDom = this.dom.find('.pro_pop_cnt');
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
		/*	
		if(this_height){
			this.onScrollToEnd = null;
			this.cntDom.css({
				'height' : this_height
			}).html('<div class="UI_scroll_body"></div>');
			var scrollbar = UI.scrollBar(this.cntDom);
			scrollbar.onScroll = function(gap){
				if(gap.bottom<20 && this_pop.onScrollToEnd){
					this_pop.onScrollToEnd && this_pop.onScrollToEnd();
				}
			};
			this.cntDom = this.cntDom.find('.UI_scroll_body');
		}
		*/
		//当有确认参数时
		if(param['confirm']){
			add_confirm(this.dom,param['confirm'],function(){
				this_pop.close();
			});
		}
		//处理title参数
		if(param['title'] == false){
			this.dom.find('.pro_pop_cpt').remove();
		}else{
			var title = param['title'] || '\u8BF7\u8F93\u5165\u6807\u9898';
			this.dom.find('.pro_pop_cpt').html(title);
			//can drag is pop
			UI.drag(this.dom.find('.pro_pop_cpt'),this.dom,{
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
		}).on('click','.pro_pop_close',function(){
			this_pop.close();
		});
		if(this._mask){
			private_maskCount++
			if(private_maskCount==1){
				private_maskDom.fadeIn(80);
			}
		}
		
	}
	POP.config = {
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
				DOM.css('zIndex',num);
			}
		}
	};
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

	/***
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

		add_confirm(this.dom,param,function(){
			this_pop.close();
		});

		//
		var newPosition = adaption(300,160);
		// create pop
		this.dom.css({
			'width' : 300,
			'left' : newPosition.clientLeft,
			'top' : newPosition.clientTop
		});

		private_maskCount++
		if(private_maskCount==1){
			private_maskDom.fadeIn(80);
		}
		private_fixedScreenDom.append(this.dom);
	}
	CONFIRM.prototype['close'] = CLOSEMETHOD


	/***
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
		this.dom.on('click','.pro_pop_confirm_ok',function(){
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
		}).on('click','.pro_pop_confirm_cancel',function(){
			this_pop.close();
		});

		var newPosition = adaption(300,160);
		// create pop
		this.dom.css({
			'width' : 300,
			'left' : newPosition.clientLeft,
			'top' : newPosition.clientTop
		});

		private_fixedScreenDom.append(this.dom);
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
		private_fixedScreenDom.append(this.dom);
		if(time != 0){
			this_prompt.close(time);
		}
	}
	prompt.prototype = {
		'tips' : function(txt){
			if(txt){
				this.dom.find('.pro_cnt').html(txt);
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
		while (!hasClass(target.className,'pro_plane')) {
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
		var DOM = private_doc[0];
		DOM.addEventListener('touchstart',checkClick);
		DOM.addEventListener('MSPointerDown',checkClick);
		DOM.addEventListener('pointerdown',checkClick);
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
		add_confirm(this.dom.find('.pro_miniChat'),param,function(){
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
		var height = this.dom.find('.pro_miniChat').height();
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
		this.cntDom = this.dom.find('.pro_coverCnt');
		this.closeDom = this.dom.find('.pro_coverClose');
		this.closeFn = param['closeFn'] || null;

		var this_html = param['html'] || '';
		//insert html
		this.cntDom.prepend(this_html);

		this.dom.on('click','.pro_coverClose',function(){
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
		private_fixedScreenDom.append(this.dom);
	}
	//使用close方法
	COVER.prototype['close'] = function(){
		var DOM = this.dom;
		this.closeDom.fadeOut(100);
		this.cntDom.animate({
			'left' : private_winW
		},400, function(){
			DOM.remove();
		});
	};



	/**
	 *  抛出对外接口
	 */
	exports.pop = function(){
		return new POP(arguments[0]);
	};
	exports.pop.config = POP.config;
	exports.miniChat = function(){
		return new miniChat(arguments[0]);
	};
	exports.confirm = function(){
		return new CONFIRM(arguments[0]);
	};
	exports.ask = function(text,callback){
		return new ASK(text,callback);
	};
	exports.prompt = function(txt,time){
		return new prompt(txt,time);
	};
	exports.plane = function(){
		return new PLANE(arguments[0]);
	};
	exports.cover = function(){
		return new COVER(arguments[0]);
	};
	exports.drag = drag;
})(UI);

/**
 *	UI.scrollBar();
 *
 **/
(function(exports){
	var scrollBar_css = ['<style type="text/css" data-module="UI_scrollBar">',
		'@font-face {',
			'font-family:"UI";',
			'src:url("/js/api/UI/images/ui-webfont.eot");',
			'src:url("/js/api/UI/images/ui-webfont.eot?#iefix") format("embedded-opentype"),',
			'url("/js/api/UI/images/ui-webfont.woff") format("woff"),',
			'url("/js/api/UI/images/ui-webfont.ttf")  format("truetype"),',
			'url("/js/api/UI/images/ui-webfont.svg#icon") format("svg");',
			'font-weight: normal;',
			'font-style: normal;',
		'}',
		'.UI_scroll_body{position:relative;width:100%;height:100%;overflow-y:scroll;}',
		'.UI_scrollBar_module{position:absolute;top:0px;right:0px;width:10px;height:100%;background:#fff;}',
		'.UI_scrollBar_cnt{top:15px;bottom:15px;position:absolute;width:100%;background:#eee;}',
		'.UI_scrollBar{position:absolute;top:10px;right:0px;width:100%;height:20px;border-radius:4px;background:#ccc;}',
		'.UI_scrollBar_up,.UI_scrollBar_down{position:absolute;width:100%;height:15px;right:0px;line-height:15px;text-align:center;color:#888;font-size:14px;font-family:"UI";background:#fff;}',
		'.UI_scrollBar_up{top:0px;}',
		'.UI_scrollBar_down{bottom:0px;}',
		'.UI_scrollBar_module a:hover{text-decoration:none;background:#aaa;color:#444;}',
		'.UI_scrollBar_module a:active{background:#666;}',
	'</style>'].join('');
	var scrollBar_tpl = ['<div class="UI_scrollBar_module">',
		'<a href="javascript:void(0)" class="UI_scrollBar_up">u</a>',
		'<div class="UI_scrollBar_cnt">',
			'<a href="javascript:void(0)" class="UI_scrollBar"></a>',
		'</div>',
		'<a href="javascript:void(0)" class="UI_scrollBar_down">d</a>',
	'</div>'].join('');
	$(function(){
		$('head').append(scrollBar_css);
	});
	//注册滚轮事件
	function scroll(dom,mouse){
		if(document.addEventListener){
			dom.addEventListener('DOMMouseScroll',mouse,false);
		}
		dom.onmousewheel=mouse;

	}
	function handuleAnimate(dom,is){
		is = is || {};
		var right,time,delayTime;
		if(is.draging){
			return
		}

		if(is.hoverCnt && is.fromOut){
			right = 0;
			time = 40;
			delayTime = 0;
			if(is.hoverBar){
			}
		}else if(is.hoverBar){
			right = 0;
			time = 80;
			delayTime = 80;
		}else if(is.hoverCnt){
			right = 0;
			time = 200;
			delayTime = 600;
		}else{
			right = -10;
			time = 300;
			delayTime = 600;
		}

		clearTimeout(is.delay);
		is.delay = setTimeout(function(){
			dom.stop().animate({
				'right' : right
			},time);
		},delayTime);
	}
	function initScroll(){
		var this_scroll = this;
		var IS = {
			'fromOut' : false,
			'draging' : false,
			'hoverBar' : false,
			'hoverCnt' : false,
			'delay' : 0
		};
		if(this.dom['origin'].css('position') == 'static'){
			this.dom['origin'].css({'position' : 'relative'});
		}
		//鼠标经过滚动条
		this_scroll.dom['all'].on('mouseenter',function(){
			IS.fromOut = false;
			IS.hoverBar = true;
			handuleAnimate(this_scroll.dom['all'],IS);
		}).on('mouseleave',function(){
			IS.fromOut = false;
			IS.hoverBar = false;
			handuleAnimate(this_scroll.dom['all'],IS);
		});
		//鼠标经过大框框、点击上下滚动
		this.dom['origin'].on('mouseenter',function(){
			IS.fromOut = true;
			IS.hoverCnt = true;
			handuleAnimate(this_scroll.dom['all'],IS);
		}).on('mouseleave',function(){
			IS.fromOut = false;
			IS.hoverCnt = false;
			handuleAnimate(this_scroll.dom['all'],IS);
		}).on('click','.UI_scrollBar_down',function(){
			this_scroll.downward();
		}).on('click','.UI_scrollBar_up',function(){
			this_scroll.upward();
		});

		//监听鼠标滚动
		scroll(this.dom['origin'][0],function(){
			//console.log('mouse is scrolling!');
			this_scroll.fix_scrollBar();
		});
		//滚动时，判断滚动到的位置,触发回调
		var scrollDelay;
		this.dom['body'].on('scroll',function(){
			clearTimeout(scrollDelay);
			scrollDelay = setTimeout(function(){
				if(this_scroll.onScroll){
					var top = parseInt(this_scroll['origin'].scrollTop);
					var bottom = parseInt(this_scroll['origin'].totalH - this_scroll['origin'].scrollTop - this_scroll['origin'].height);
					this_scroll.onScroll({
						'top' : top,
						'bottom' : bottom
					});
				}
			},100);
		});

		//定时刷新滚动条（内部高度可能会自动变化）
		setInterval(function(){
			this_scroll.fix_scrollBar();
		},1200);
		//拖动触发滚动
		UI.drag(this.dom['bar'],this.dom['bar'],{
			'start' : function(){
				IS.draging = true;
			},
			'move' : function(dx,dy,l_start,t_start,w_start,h_start){
				var top = dy + t_start;
				this_scroll.fix_content(top);
			},
			'end' : function(){
				IS.draging = false;
				handuleAnimate(this_scroll.dom['all'],IS);
			}
		});

		this.dom['origin'].append(this.dom['all']);
		this_scroll.dom['all'].css('right', -10);
		//hide default scroll bar
		setTimeout(function(){
			//console.log(1,this_scroll.dom['body'].width(),this_scroll.dom['body'][0].clientWidth);
			this_scroll.dom['body'].css({
				'width' : this_scroll.dom['body'].width()*2 - this_scroll.dom['body'][0].clientWidth
			});
		},100);
	}
	function scrollBar(cnt_dom){
		if(typeof(cnt_dom) != 'object'){
			return
		}
		if(cnt_dom.find('.UI_scroll_body').length == 0){
			return
		} 
		this.dom = {};
		this.dom['origin'] = cnt_dom;
		this.dom['body'] = this.dom['origin'].find('.UI_scroll_body')
		this.dom['all'] = $(scrollBar_tpl);
		this.dom['bar'] = this.dom['all'].find('.UI_scrollBar');
		this.onScroll = null;

		this.origin = {
			'scrollTop' : 0,
			'height' : 0,
			'totalH' : 0
		};
		this.bar = {
			'top' : 0,
			'height' : 0,
			'totalH' : 0
		};
		initScroll.call(this);
	}
	scrollBar.prototype = {
		'fix_scrollBar' : function(){
			//刷新目标对象的尺寸位置
			this.origin.totalH = this.dom['body'][0].scrollHeight;
			this.origin.height = this.dom['origin'].height();
			this.origin.scrollTop = this.dom['body'].scrollTop();
			//计算滚动条尺寸及位置
			this.bar.totalH = this.origin.height-30;
			this.bar.top = (this.origin.scrollTop/this.origin.totalH)*this.bar.totalH;
			this.bar.height = (this.origin.height/this.origin.totalH)*this.bar.totalH;
			//设置滚动条
			this.dom['bar'].stop().animate({
				'top' : this.bar.top,
				'height' : this.bar.height
			},80);
		},
		'fix_content' : function(top){
			if(top < 0){
				this.bar.top = 0;
			}else if(top > this.bar.totalH - this.bar.height){
				this.bar.top = this.bar.totalH - this.bar.height;
			}else{
				this.bar.top = top;
			}
			this.dom['bar'].css({
				'top' : this.bar.top
			});
			this.origin.scrollTop = this.bar.top/this.bar.totalH * this.origin.totalH;
			this.dom['body'].scrollTop(this.origin.scrollTop);
		},
		'downward' : function(){
			var top = this.bar.top + 10;
			this.fix_content(top);
		},
		'upward' : function(){
			var top = this.bar.top - 10;
			this.fix_content(top);
		}
	};

	exports.scrollBar = function(dom){
		return new scrollBar(dom);
	};
})(window.UI);

//提供CommonJS规范的接口
window.define && define(function(require,exports,module){
	//对外接口
	exports.ask = window.UI.ask;
	exports.pop = window.UI.pop;
	exports.miniChat = window.UI.miniChat;
	exports.confirm = window.UI.confirm;
	exports.prompt = window.UI.prompt;
	exports.plane = window.UI.plane;
	exports.cover = window.UI.cover;
	exports.drag = window.UI.drag;
});
