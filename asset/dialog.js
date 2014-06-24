/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2014-6-18 14:52
 * 
 * Function depends on
 *		JQUERY
 * 
 * 
 **/

(function(global,doc,jQuery,UI_factory,utils_factory){
	
	var utils = utils_factory();
	//初始化工具
	var factory = UI_factory(global,doc,jQuery,utils);
	
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
	global.UI.config = factory.config;
	
	//提供CommonJS规范的接口
	global.define && define(function(){
		return factory;
	});
})(this,document,jQuery,function(window,document,jQuery,utils){
	/**
	 * base template
	 *
	 */
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
		'<div class="UI_select_body">',
			'{caption}',
			'<div class="UI_selectCnt">{list}</div>',
		'</div>',
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
		'.UI_pop_cpt{position:relative;height:40px;line-height:40px;overflow:hidden;border-bottom:1px solid #ebebeb;',
			'color:#333;font-size:16px;text-indent:15px;cursor: default;}',
		'.UI_pop_cnt{position:relative;min-height:100px;overflow:auto;width:100%;}',
		'.UI_pop_close{display:block;position:absolute;top:0px;right:0px;width:40px;height:40px;text-align:center;line-height:40px;color:#ddd;font-family:"Simsun";font-size:24px;font-weight:bold;text-decoration:none;transition:0.1s;}',
		'.UI_pop_close:hover{color:#888;text-decoration:none;}',
		'.UI_pop_close:active{color:#444}',
		'.UI_confirm{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333;}',
		'.UI_ask{_border:1px solid #eee;position:absolute;background:#fff;border-radius:4px;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_ask_text{padding:30px 10px 10px;line-height:26px;text-align:center;font-size:20px;color:#333;}',
		'.UI_ask input{display:block;margin:0px auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-size;width:90%;}',
		'.UI_miniChatSlideCnt{width:220px;height:0px;overflow:hidden;position:absolute;border-radius:4px;box-shadow:2px 3px 10px rgba(0,0,0,0.6);}',
		'.UI_miniChat{position:absolute;left:0px;bottom:0px;width:100%;_border:1px solid #eee;background:#fff;overflow:hidden;}',
		'.UI_miniChat_text{padding:20px 10px 10px;box-sizing:content-box;line-height:24px;text-align:center;font-size:14px;color:#333;}',
		'.UI_miniChat .UI_pop_confirm a{height:26px;line-height:26px;}',
		'.UI_pop_confirm{height:40px;text-align:center;border-top:1px solid #eee;}',
		'.UI_pop_confirm a{display:block;width:50%;height:40px;float:left;font-size:14px;line-height:40px;color:#03f;box-sizing:border-box;}',
		'.UI_pop_confirm_ok{border-right:1px solid #eee;}',
		'.UI_pop_confirm a:hover{text-decoration: none;}',
		'.UI_plane{width:200px;position:absolute;top:400px;left:300px;}',
		'.UI_prompt{width:240px;position:absolute;padding:30px 10px;box-sizing:content-box;background:#fff;_border:1px solid #fafafa;border-radius:4px;box-shadow:2px 2px 10px rgba(0,0,0,0.5);}',
		'.UI_cnt{font-size:18px;color:#222;text-align:center;}',
		'.UI_cover{position:absolute;top:0px;left:0px;width:100%;height:100px;}',
		'.UI_coverCnt{position:relative;width:100%;height:100%;background:#fff;}',
		'.UI_coverClose{display:block;position:absolute;top:50%;left:0px;width:20px;height:60px;padding-left:5px;text-align:center;line-height:60px;color:#ddd;font-family:"Simsun";font-size:30px;background:#555;}',
		'.UI_coverClose:hover{background-color:#333;color:#fff;text-decoration:none;}',
		
		'.UI_select{position:absolute;width:100%;bottom:0px;padding-bottom:10px;}',
		'.UI_select a{display:block;height:40px;line-height:40px;text-align:center;color:#03f;font-size:16px;}',
		'.UI_select_body{margin:0px 10px 10px;border-radius:8px;overflow:hidden;background:#fff;}',
		'.UI_selectCpt{padding:8px 0px;}',
		'.UI_selectCpt h3,.UI_selectCpt p{margin:0px;font-size:15px;line-height:18px;text-align:center;color:#aaa;font-weight:normal;}',
		'.UI_selectCpt p{font-size:12px;}',
		'.UI_selectCnt a{border-top:1px solid #eee;margin-top:-1px;}',
		'.UI_selectCancel{margin:0px 10px;border-radius:8px;overflow:hidden;background:#fff;}',
		
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
	var private_allCnt = utils.createDom(allCnt)[0],
		 private_maskDom = $(private_allCnt).find('.UI_mask')[0],
		 private_mainDom = $(private_allCnt).find('.UI_main_cnt')[0],
		 private_fixedScreenTopDom = $(private_allCnt).find('.UI_fixedScreenTop_cnt')[0],
		 private_fixedScreenBottomDom = $(private_allCnt).find('.UI_fixedScreenBottom_cnt')[0],
		 private_window = window,
		 private_winW,
		 private_winH,
		 private_doc = document,
		 private_docH,
		 private_scrollTop,
		 private_isSupportTouch = "ontouchend" in document ? true : false,
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
		private_winW = document.body.scrollWidth;
		private_scrollTop = jQuery(private_window).scrollTop();
		private_winH = window.innerHeight;
		private_docH = jQuery(document).height();
	}
	jQuery('head').append(popCSS);
	jQuery('body').append(private_allCnt);
	
	//release useless memory
	popCSS = null;
	allCnt = null;

	//更新窗口尺寸
	countSize();
	jQuery(function(){
		countSize();
		setTimeout(countSize,500);
	});
	/**
	 *	fix Prompt Mask position & size 
	 */ 
	if(isIE67){
		utils.css(
			private_maskDom,
			{
				'height' : private_docH
			}
		);
		utils.css(
			private_fixedScreenTopDom,
			{
				'top' : private_scrollTop
			}
		);
		
		utils.css(
			private_fixedScreenBottomDom,
			{
				'top' : private_scrollTop + private_winH
			}
		);
		
		jQuery(private_window).on('resize scroll',function(){
			//更新窗口尺寸
			countSize();
			
			utils.animation(
				private_fixedScreenTopDom,
				{
					'top' : private_scrollTop
				},
				100
			);
			
			utils.animation(
				private_fixedScreenBottomDom,
				{
					'top' : private_scrollTop + private_winH
				},
				100
			);
			
			utils.css(
				private_maskDom,
				{
					'top' : private_scrollTop,
					'height' : private_winH
				}
			);
		});
	}else{
		
		utils.css(
			private_fixedScreenTopDom,
			{
				'position' : 'fixed',
				'top' : 0
			}
		);
		
		utils.css(
			private_fixedScreenBottomDom,
			{
				'position' : 'fixed',
				'bottom' : 0
			}
		);
		
		utils.css(
			private_maskDom,
			{
				'height' : private_docH
			}
		);
		
		jQuery(private_window).on('resize scroll',function(){
			//更新窗口尺寸
			countSize();
			utils.css(
				private_maskDom,
				{
					'height' : private_docH
				}
			);
		});
	}
	
	//通用拖动方法
	function drag(handle_dom,dom,param){
		var param = param || {};
		var moving = param['move'] || null;
		var start = param['start'] || null;
		var end = param['end'] || null;
		var dragMask = jQuery('<div style="width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:100000;cursor:default;"></div>');

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
			jQuery(document).mousemove(move).mouseup(up);
			utils.css(
				dragMask[0],
				{
					'width' : private_winW,
					'height' : private_winH,
					'top' : 0,
					'left' : 0,
					'cursor' : handle_dom.css('cursor')
				}
			);
			jQuery(private_fixedScreenTopDom).append(dragMask);
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
			jQuery(document).unbind("mousemove", move).unbind("mouseup", up);
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
		jQuery(dom).append(this_html);
		jQuery(dom).on('click','.UI_pop_confirm_ok',function(){
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
			jQuery(private_maskDom).show();
		}
	}
	/**
	 * 公用关闭方法
	 *  
	 */
	function CLOSEMETHOD(effect,time){
		this.closeFn && this.closeFn();
		var DOM = this.dom;
		if(!effect){
			DOM.remove();
		}else{
			var method = 'fadeOut';
			var time = time ? parseInt(time) : 80;
			if(effect == 'fade'){
				utils.fadeOut(DOM,time,function(){
					DOM.remove();
				});
			}else if(effect == 'slide'){
				utils.slideUp(DOM,time,function(){
					DOM.remove();
				});
			}
		}

		if(this._mask){
			private_maskCount--
			if(private_maskCount==0){
				utils.fadeOut(private_maskDom,80);
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
		
		this.dom = utils.createDom(pop_tpl)[0];
		this.cntDom = jQuery(this.dom).find('.UI_pop_cnt')[0];
		this.closeFn = param['closeFn'] || null;
		this._mask = param['mask'] || false;

		var this_html = param['html'] || '';
		var this_width = param['width'] || Math.min(600,private_winW-20);
		var this_height = param['height'] ? parseInt(param['height']) : null;


		//预定高度时
		if(this_height){
			jQuery(this.cntDom).css({
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
			jQuery(this.dom).find('.UI_pop_cpt').remove();
		}else{
			var title = param['title'] || '\u8BF7\u8F93\u5165\u6807\u9898';
			jQuery(this.dom).find('.UI_pop_cpt').html(title);
			//can drag is pop
			UI.drag(jQuery(this.dom).find('.UI_pop_cpt'),jQuery(this.dom),{
				'move' : function(dx,dy,l_start,t_start,w_start,h_start){
					var top = dy + t_start;
					var left = dx + l_start;
					var newSize = fix_position(top,left,w_start,h_start);
					utils.css(
						this_pop.dom,
						{
							'left' : newSize.left,
							'top' : newSize.top
						}
					);
				}
			});
		}


		//insert html
		jQuery(this.cntDom).prepend(this_html);
		
		jQuery(private_mainDom).append(this.dom);
		
		//fix position get size
		var fixSize = adaption(this_width,(this_height?this_height:jQuery(this.dom).height()));
		var top = typeof(param['top']) == 'number' ? param['top'] : fixSize.top;
		var left = typeof(param['left']) == 'number' ? param['left'] : fixSize.left;
		
		// create pop
		utils.css(
			this.dom,
			{
				'width' : this_width,
				'left' : left,
				'top' : top
			}
		);
		jQuery(this.dom).on('click','.UI_pop_close',function(){
			this_pop.close();
		});
		if(this._mask){
			showMask();
		}
		
	}
	//使用close方法
	POP.prototype['close'] = CLOSEMETHOD;
	POP.prototype['adapt'] = function(){
		var offset = jQuery(this.dom).offset();
		var width = jQuery(this.dom).width();
		var height = jQuery(this.dom).height();

		var fixSize = adaption(width,height);
	//	console.log(offset,fixSize,'-----------');
		utils.animation(
			this.dom,
			{
				'top' : fixSize.top,
				'left' : fixSize.left
			}, 100
		);
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
		this.dom = utils.createDom(this_html)[0];
		this.closeFn = param['closeFn'] || null;
		
		//显示蒙层
		showMask();
		add_confirm(this.dom,param,function(){
			this_pop.close();
		});
		var newPosition = adaption(300,160);
		// create pop
		utils.css(
			this.dom,
			{
				'width' : 300,
				'left' : newPosition.clientLeft,
				'top' : newPosition.clientTop
			}
		);
		jQuery(private_fixedScreenTopDom).append(this.dom);

	}
	CONFIRM.prototype['close'] = CLOSEMETHOD


	/**
	 * ASK 
	 */
	function ASK(text,callback){
		var this_pop = this;

		var this_text = text || '\u8BF7\u8F93\u5165\u786E\u8BA4\u4FE1\u606F！';
		var this_html = ask_tpl.replace(/{text}/,this_text);

		this.dom = utils.createDom(this_html)[0];
		this.closeFn =  null;
		this.callback = callback || null;

		var this_html = confirmBar_tpl.replace(/{(\w+)}/g,function(a,key){
			if(key == 'confirm'){
				return '确定';
			}else if(key == 'cancel'){
				return '取消';
			}
		});
		jQuery(this.dom).append(this_html);
		jQuery(this.dom).on('click','.UI_pop_confirm_ok',function(){
			var value = jQuery(this_pop.dom).find('input').val();
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
		utils.css(
			this.dom,
			{
				'width' : 300,
				'left' : newPosition.clientLeft,
				'top' : newPosition.clientTop
			}
		);

		jQuery(private_fixedScreenTopDom).append(this.dom);
	}
	ASK.prototype['close'] = CLOSEMETHOD;
	ASK.prototype['setValue'] = function(text){
		var text = text ? text.toString() : '';
		jQuery(this.dom).find('input').val(text);
	};


	/**
	 * prompt
	 * 
	 **/
	function prompt(txt,time){
		var this_prompt = this;
		var txt = txt || '\u8BF7\u8F93\u5165\u5185\u5BB9';
		this.dom = utils.createDom(prompt_tpl)[0];

		this.tips(txt);


		var newPosition = adaption(260,100);
		// create pop

		utils.css(
			this.dom,
			{
				'left' : newPosition.clientLeft,
				'top' : newPosition.clientTop
			}
		);
		//console.log(private_winH,12);
		jQuery(private_fixedScreenTopDom).append(this.dom);
		if(time != 0){
			this.close(time);
		}
	}
	prompt.prototype = {
		'tips' : function(txt){
			if(txt){
				jQuery(this.dom).find('.UI_cnt').html(txt);
			}
		},
		'close' : function(time){
			var delay = time ? parseInt(time) : 1300 ;
			var this_prompt = this;

			setTimeout(function(){
				jQuery(this_prompt.dom).fadeOut(200,function(){
					jQuery(this_prompt.dom).remove();
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
		var doc = private_doc;
		doc.addEventListener('touchstart',checkClick);
		doc.addEventListener('MSPointerDown',checkClick);
		doc.addEventListener('pointerdown',checkClick);
	}else{
		//PC鼠标事件
		jQuery(document).on('mousedown',checkClick);
	}


	function PLANE(param){
		//如果有已展开的PLANE，干掉他
		private_activePlane&&private_activePlane.close();
		private_activePlane = this;

		var param = param || {};
		var this_plane = this;		

		var this_html = param['html'] || '';
		this.closeFn = param['closeFn'] || null;

		this.dom = utils.createDom(plane_tpl)[0];

		//insert html
		jQuery(this.dom).html(this_html);
		utils.css(
			this.dom,
			{
				'width' : param['width'] || 240,
				'height' :param['height'] || null,
				'top' : param['top'] || 300,
				'left' : param['left'] || 800
			}
		)
		jQuery(private_mainDom).append(this.dom);
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
		this.dom = utils.createDom(this_tpl)[0];
		//当有确认参数时
		add_confirm(jQuery(this.dom).find('.UI_miniChat'),param,function(){
			this_chat.close();
		});
		

		var fixSize = adaption(220,110);
		
		var top = typeof(param['top']) == 'number' ? param['top'] : fixSize.top;
		var left = typeof(param['left']) == 'number' ? param['left'] : fixSize.left;

		// create pop
		utils.css(
			this.dom,
			{
				'left' : left,
				'top' : top
			}
		);
		
		jQuery(private_mainDom).append(this.dom);
		var height = jQuery(this.dom).find('.UI_miniChat').height();
		
		utils.animation(
			this.dom,
			{
				'height' : height
			}, 100
		);
		
	}
	miniChat.prototype['close'] = CLOSEMETHOD;



	/***
	 * 全屏弹框
	 * COVER 
	 */
	function COVER(param){
		var param = param || {};
		var this_cover = this;
		this.dom = utils.createDom(cover_tpl)[0];
		this.cntDom = jQuery(this.dom).find('.UI_coverCnt')[0];
		this.closeDom = jQuery(this.dom).find('.UI_coverClose')[0];
		this.closeFn = param['closeFn'] || null;

		var this_html = param['html'] || '';
		//insert html
		jQuery(this.cntDom).prepend(this_html);

		jQuery(this.dom).on('click','.UI_coverClose',function(){
			this_cover.close();
		});

		jQuery(this.closeDom).hide();
		// create pop
		utils.css(
			this.dom,
			{
				'height' : private_winH
			}
		);
		utils.css(
			this.cntDom,
			{
				'left' : private_winW
			}
		);
		utils.animation(
			this.cntDom,
			{
				'left' : 0
			}, 200,{
				'complete' : function(){
					utils.fadeIn(this_cover.closeDom,100);
				}
			}
		);
		
		jQuery(private_fixedScreenTopDom).append(this.dom);
	}
	//使用close方法
	COVER.prototype['close'] = function(){
		var dom_all = jQuery(this.dom);
		
		utils.fadeOut(this.closeDom,100);
		utils.animation(this.cntDom,
			{
				'left' : private_winW
			},
			400,
			{
				'complete' : function(){
					dom_all.remove();
				}
			}
		);
	};

	/**
	 * 选择功能
	 */
	function SELECT(list,param){
		var this_sel = this;
		
		var list = list || [];
		var param = param || {};
		
		var caption_html = '';
		if(param.title){
			caption_html += '<div class="UI_selectCpt">';
			if(param.title){
				caption_html += '<h3>' + param.title + '</h3>';
			}
			if(param.intro){
				caption_html += '<p>' + param.intro + '</p>';
			}
			caption_html += '</div>';
		}
		
		var fns = [];
		var list_html = '';
		for(var i=0,total=list.length;i<total;i++){
			list_html += '<a href="javascript:void(0)" data-index="' + i + '">' + list[i][0] + '</a>';
			fns.push(list[i][1]);
		}
		var this_html = select_tpl.replace(/\{(\w+)\}/g,function(a,b){
			if(b == 'list'){
				return list_html;
			}else if(b == 'caption'){
				return caption_html;
			}
		});
		
		this.dom = utils.createDom(this_html)[0];
		this._mask = true;
		
		
		//显示蒙层
		showMask();
		utils.css(
			this.dom,
			{
				'bottom' : -100,
				'opacity' : 0
			}
		);
		jQuery(private_fixedScreenBottomDom).append(this.dom);
		
		utils.animation(this.dom, {
			'bottom' : 0,
			'opacity' : 1
	        }, 400, 'Bounce.easeOut'
        );
		
		jQuery(this.dom).on('click','a',function(){
			var txt = jQuery(this).html();
			var index = jQuery(this).attr('data-index');
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
					utils.css(
						private_allCnt,
						{'zIndex':num}
					);
					utils.css(
						private_fixedScreenBottomDom,
						{'zIndex':num}
					);
					utils.css(
						private_fixedScreenTopDom,
						{'zIndex':num}
					);
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
			return new SELECT(arguments[0],arguments[1]);
		},
		'drag' : drag
	};
},function () {
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
	
	function objType(obj) {
		switch (Object.prototype.toString.call(obj)) {
			case "[object Object]":
				return "Object";
			case "[object Number]":
				return "Number";
			case "[object Array]":
				return "Array";
		}
	}
	function getStyle(elem, name) { //
		var w3style;
		if (document.defaultView) {
			var style = document.defaultView.getComputedStyle(elem, null);
			name == "borderWidth" ? name = "borderLeftWidth" : name; // 解决标准浏览器解析问题
			w3style = name in style ? style[name] : style.getPropertyValue(name);
			w3style == "auto" ? w3style = "0px" : w3style;
		}
		return elem.style[name] ||
		(elem.currentStyle && (elem.currentStyle[name] == "auto" ? "0px" : elem.currentStyle[name])) || w3style;
	}
	
	// 此处只能获取属性值为数值类型的style属性
	function getOriCss (elem, cssObj) {
		var cssOri = [];
		for (var prop in cssObj) {
			if (!cssObj.hasOwnProperty(prop)) continue;
			//if (prop != "opacity") cssOri.push(parseInt(getStyle(elem, prop)));
			//else cssOri.push(100 * getStyle(elem, prop));
			if (getStyle(elem, prop) == "transparent" || /^#|rgb\(/.test(getStyle(elem, prop))) {
				if (getStyle(elem, prop) == "transparent") {
					cssOri.push([255, 255, 255]);
				}
				if (/^#/.test(getStyle(elem, prop))) {
					cssOri.push(color.GetColors(getStyle(elem, prop)));
				}
				if (/^rgb\(/.test(getStyle(elem, prop))) {
					//cssOri.push([getStyle(elem, prop).replace(/^rgb\(\)/g, "")]);
					var regexp = /^rgb\(([0-9]{0,3}),\s([0-9]{0,3}),\s([0-9]{0,3})\)/g;
					var re = getStyle(elem, prop).replace(regexp, "jQuery1 jQuery2 jQuery3").split(" ");
					//cssOri.push(re); // re为字符串数组
					cssOri.push([parseInt(re[0]), parseInt(re[1]), parseInt(re[2])]);
				}
			} else if (prop == "opacity") {
				cssOri.push(100 * getStyle(elem, prop));
			} else {
				cssOri.push(parseInt(getStyle(elem, prop)));
			}
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
	 * 原始的设置css方法
	 *
	 *
	 */
	function setCss(elem,prop,value){
		if(value == null){
			return
		}
		prop = prop.toString();
		if (prop == "opacity") {
			value = value / 100;
		} else if (value === +value){
			value = value + "px";
		}
		
		elem.style[prop] = value;
	}
	
    function _anim() {
		var args = arguments;
        this.elem = args[0];
		this.cssObj = args[1];
		this.cssOri = getOriCss(this.elem, args[1]);
		this.cssEnd = parseCssObj(args[1]);
		this.durtime = args[2];
		this.animType = "Linear";
		this.funObj = null;
		this.start = false;
		this.complete = false;
		this.onPause = false;
		
		if (args.length < 3) {
			throw new Error("至少要传入3个参数");
		} else if (args.length == 4) {
			if (objType(args[3]) == "Object") {
				this.funObj = args[3];
				for (var p in this.funObj) {
					if (p.toString() == "start") this.start = true;
					if (p.toString() == "complete") this.complete = true;
				}
			}
			if (typeof (args[3]) == "string") {
				this.animType = args[3];
			}
		} else if (args.length == 5) {
			this.animType = args[3];
			if (objType(args[4]) == "Object") {
				this.funObj = args[4];
				for (var p in this.funObj) {
					if (p.toString() == "start") this.start = true;
					if (p.toString() == "complete") this.complete = true;
				}
			}
		}
		this.animType = 'Tween.' + this.animType;
		this.startAnim();
    }
    _anim.prototype = {
        startAnim: function () {
            if (this.start)this.funObj["start"].call(this, this.elem);
            var that = this;
            var t = 0;
            var props = [];
            for (var pro in this.cssObj) {
                if (!this.cssObj.hasOwnProperty(pro)){
					continue;
				}
                props.push(pro);
            }
            var tt = new Date().getTime();
            clearInterval(this.timer);
            this.timer = setInterval(function () {
                if (that.onPause) {
                    clearInterval(that.timer);
                    return;
                }
                if (t < that.durtime / 10) {
                    t++;
                    for (var i = 0; i < props.length; i++) {
                        var b, c,value;
                        objType(that.cssOri[i]) != "Array" && (b = that.cssOri[i]); //开始值
                        objType(that.cssEnd[i]) != "Array" && (c = that.cssEnd[i] - that.cssOri[i]); // 变化量
                        var d = that.durtime / 10; // 持续时间
                        if (objType(that.cssOri[i]) == "Array" && objType(that.cssEnd[i]) == "Array") {
                            var b1 = that.cssOri[i][0], b2 = that.cssOri[i][1], b3 = that.cssOri[i][2];
                            var c1 = that.cssEnd[i][0] - that.cssOri[i][0],
                                c2 = that.cssEnd[i][1] - that.cssOri[i][1],
                                c3 = that.cssEnd[i][2] - that.cssOri[i][2];
                            var r = color.hex(Math.ceil((eval(that.animType))(t, b1, c1, d))),
                                g = color.hex(Math.ceil((eval(that.animType))(t, b2, c2, d))),
                                b = color.hex(Math.ceil((eval(that.animType))(t, b3, c3, d)));
								value = [r,g,b];
                        } else {
							value = Math.ceil((eval(that.animType))(t, b, c, d));
                        }
						
						setCss(that.elem,props[i],value);
                    }
                } else {
                    for (var i = 0; i < props.length; i++) {
                        if (objType(that.cssOri[i]) == "Array" && objType(that.cssEnd[i]) == "Array") {
                            var c1 = that.cssEnd[i][0],
                                c2 = that.cssEnd[i][1],
                                c3 = that.cssEnd[i][2];
                            var r = color.hex(Math.ceil((eval(that.animType))(t, b1, c1, d))),
                                g = color.hex(Math.ceil((eval(that.animType))(t, b2, c2, d))),
                                b = color.hex(Math.ceil((eval(that.animType))(t, b3, c3, d)));
								
							setCss(that.elem,props[i],[r,g,b]);
                        } else {
							setCss(that.elem,props[i],that.cssEnd[i]);
                        }
                    }
                    clearInterval(that.timer);
                    if (that.complete){
						that.funObj["complete"].call(that, that.elem);
					}
                }
            }, 10); // 一般要给10毫秒异步调用时间，不能是1
        },
        pause: function () {
            this.onPause = true;
        }
    }
	
	
	//创建dom
	function createDom(str){
		var a = document.createElement('div');
		a.innerHTML = str;
		return a.childNodes;
	}
    return{
		'css' : function(dom,cssObj){
			var cssVal = parseCssObj(cssObj);
			
            for (var pro in cssObj) {
                if (!cssObj.hasOwnProperty(pro)){
					continue;
				}
				setCss(dom,pro,cssObj[pro]);
            }
			
		},
		'slideDown' : function(DOM,time,fn){
			DOM.style['overflow'] = 'hidden';
			DOM.style['opacity'] = 0;
			DOM.style['display'] = 'block';
			new _anim(
				DOM,
				{
					'height' : 0,
					'padding' : 0
				}, time,{
					'complete' : function(){
						fn && fn.call(DOM);
					}
				}
			);
		},
		'slideUp' : function(DOM,time,fn){
			DOM.style['overflow'] = 'hidden';
			new _anim(
				DOM,
				{
					'height' : 0,
					'padding' : 0
				}, time,{
					'complete' : function(){
						DOM.style['display'] = 'none';
						fn && fn.call(DOM);
					}
				}
			);
		},
		'fadeIn' : function(DOM,time,fn){
			DOM.style['opacity'] = 0;
			DOM.style['display'] = 'block';
			new _anim(
				DOM,
				{
					'opacity' : 1,
					'padding' : 0
				}, time,{
					'complete' : function(){
						fn && fn.call(DOM);
					}
				}
			);
			
		},
		'fadeOut' : function(DOM,time,fn){
			var op = getStyle(DOM,'opacity');
			new _anim(
				DOM,
				{
					'opacity' : 0
				}, time,{
					'complete' : function(){
						DOM.style['opacity'] = op;
						DOM.style['display'] = 'none';
						fn && fn.call(DOM);
					}
				}
			);
		},
		'animation' : function(a,b,c,d) {
			return new _anim(a,b,c,d);
		},
		'createDom' : createDom
		
    }
});