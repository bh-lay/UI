/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified 2016-9-5 22:24
 * 
 **/

(function( global, doc, UI_factory, BaseClass_factory, utils_factory){

      //初始化工具类
  var utils = utils_factory(global,doc),
      BaseClass = BaseClass_factory( utils ),
      //初始化UI模块
      UI = UI_factory( global, doc, utils, BaseClass );

  //提供window.UI的接口
  global.UI = global.UI || UI;
  global.UI._utils = utils;

  //提供CommonJS规范的接口
  global.define && define(function(){
    return UI;
  });
})(window,document,function( window, document, utils, BaseClass ){
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
  var allCnt_tpl = '<div class="UI_lawyer"><div class="UI_mask"></div></div>',
      pop_tpl = '<div class="UI_pop"><div class="UI_pop_cpt"></div><div class="UI_cnt"></div><a href="javascript:;" class="UI_pop_close" title="\u5173\u95ED">×</a></div>',
      confirm_tpl = '<div class="UI_confirm"><div class="UI_confirm_text"><%=text %></div></div>',
      ask_tpl = '<div class="UI_ask"><div class="UI_ask_text"><%=text %></div><input class="UI_ask_key" type="text" name="UI_ask_key"/></div>',
      confirmBar_tpl = '<div class="UI_pop_confirm"><a href="javascript:;" class="UI_pop_confirm_ok"><%=confirm %></a><a href="javascript:;" class="UI_pop_confirm_cancel"><%=cancel %></a></div>',
      prompt_tpl = '<div class="UI_prompt"><div class="UI_cnt"></div></div>',
      cover_tpl = '<div class="UI_cover"><div class="UI_cnt"></div><a href="javascript:;" class="UI_close UI_coverClose">×</a></div>',
      plane_tpl = '<div class="UI_plane"></div>',
      select_tpl = '<div class="UI_select"><div class="UI_select_body UI_cnt"><% if(title){ %><div class="UI_selectCpt"><h3><%=title %></h3><% if(intro){ %><p><%=intro %></p><% } %></div><% } %><div class="UI_selectCnt"><% for(var i=0,total=list.length;i<total;i++){ %><a class="UI_select_btn" href="javascript:;"><%=list[i] %></a><% } %></div></div><div class="UI_selectCancel"><a class="UI_select_btn" href="javascript:;">取消</a></div></div>',
      popCSS = '.UI_lawyer{position:absolute;top:0;left:0;z-index:4999;width:100%;height:0;overflow:visible;font-family:"Microsoft Yahei"}.UI_lawyer a,.UI_lawyer a:hover,.UI_lawyer a:active{outline:none;text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color:transparent}.UI_mask{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;opacity:0.6;filter:alpha(opacity=60);display:none}.UI-blur{transform:translate3d(0,0,0);-webkit-filter:blur(3px)}.UI-noscroll{overflow:hidden}.UI_pop{width:200px;position:absolute;top:400px;left:300px;background:#fff;box-shadow:2px 3px 10px rgba(0,0,0,0.6)}.UI_pop_cpt{position:relative;height:36px;line-height:36px;overflow:hidden;border-bottom:1px solid #ebebeb;color:#777;font-size:16px;text-indent:15px;cursor:default}.UI_pop .UI_cnt{position:relative;min-height:100px;overflow:auto}.UI_pop_close{display:block;position:absolute;top:0;right:0;width:40px;height:36px;text-align:center;color:#ddd;font:bold 20px/36px "simsun";transition:0.1s}.UI_pop_close:hover{color:#888}.UI_pop_close:active{color:#222}.UI_confirm{width:300px;position:absolute;background:#fff;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6)}.UI_confirm_text{padding:30px 10px 20px;line-height:26px;text-align:center;font-size:20px;color:#333}.UI_ask{width:300px;position:absolute;background:#fff;overflow:hidden;box-shadow:2px 3px 10px rgba(0,0,0,0.6)}.UI_ask_text{padding:25px 10px 15px;line-height:26px;text-align:center;font-size:18px;color:#333}.UI_ask input{display:block;margin:0 auto 15px;height:30px;padding:4px 4px;line-height:22px;box-sizing:border-box;width:90%}.UI_pop_confirm{overflow:hidden;text-align:center;border-top:1px solid #ddd;white-space:nowrap}.UI_pop_confirm a{display:inline-block;width:50%;font-size:14px;line-height:36px;color:#03f;transition:0.15s}.UI_pop_confirm a:hover{background:#eee}.UI_pop_confirm_ok{border-right:1px solid #ddd}.UI_prompt{position:absolute;width:240px;background:#fff;box-shadow:2px 2px 10px rgba(0,0,0,0.5)}.UI_prompt .UI_cnt{padding:30px 10px;font-size:18px;color:#333;text-align:center}.UI_plane{position:absolute}.UI_cover{position:absolute;left:0;width:100%;height:100%}.UI_cover .UI_cnt{position:relative;width:100%;height:100%;background:#fff;overflow:auto}.UI_coverClose{display:block;position:absolute;top:10px;right:20px;width:30px;height:30px;text-align:center;color:#aaa;font:18px/30px "simsun";background:#eee;border-radius:15px;border:1px solid #aaa}.UI_coverClose:hover{background:#333;color:#fff;transition:0.2s}.UI_select{position:absolute;width:200px;box-shadow:2px 2px 2px rgba(0,0,0,0.6)}.UI_select a{display:block;height:40px;line-height:40px;text-align:center;color:#03f;font-size:16px}.UI_select_body{overflow:hidden;background:#fff}.UI_selectCpt{padding:8px 0}.UI_selectCpt h3,.UI_selectCpt p{margin:0;font-size:15px;line-height:18px;text-align:center;color:#aaa;font-weight:normal}.UI_selectCpt p{font-size:12px}.UI_selectCnt a{height:34px;line-height:34px;font-size:14px;border-top:1px solid #ddd}.UI_selectCnt a:hover{background:#eee}.UI_selectCancel{display:none}@media(max-width:640px){.UI_select{position:fixed;bottom:0;width:100%;padding-bottom:10px}.UI_select_body, .UI_selectCancel{margin:0 10px;border-radius:8px}.UI_select_body{margin:0 10px 10px;top:initial !important}.UI_selectCancel{display:block;background:#fff}}.UI_ie678 .UI_pop,.UI_ie678 .UI_confirm,.UI_ie678 .UI_ask,.UI_ie678 .UI_prompt,.UI_ie678 .UI_select{outline:3px solid #ccc}/** * CSS3动画 * **/@-webkit-keyframes UI-fadeInDown{0%{opacity:0;-webkit-transform:translateY(10px)}100%{opacity:1;-webkit-transform:translateY(0)}}@keyframes UI-fadeInDown{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}@-webkit-keyframes UI-fadeOutUp{0%{opacity:1;-webkit-transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(10px)}}@keyframes UI-fadeOutUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(10px)}}.UI-fadeIn{-webkit-animation:UI-fadeInDown 0.2s ease both;animation:UI-fadeInDown 0.2s ease both}.UI-fadeOut{-webkit-animation:UI-fadeOutUp 0.2s ease both;animation:UI-fadeOutUp 0.2s ease both}';

  var isIE67,
    isIE678;
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
      private_scrollTop,
      private_config_zIndex = 499,
      private_config_gap = {
        top : 0,
        left : 0,
        bottom : 0,
        right : 0
      },
      // 默认弹框动画
      private_config_defaultAnimationClass = [ 'UI-fadeIn', 'UI-fadeOut' ];

  var docDom = document.compatMode == "BackCompat" ? private_body : document.documentElement;

//重新计算浏览器窗口尺寸
  function refreshSize(){
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
        active_objs[i].close && active_objs[i].close();
        active_objs[i].destroy && active_objs[i].destroy();
        break;
      }
    }
  }
  //最后一个有蒙层的对象的zIndex值，
  function last_has_mask_zIndex(){
    //逆序遍历所有显示中的对象
    for(var i= active_objs.length-1;i>=0;i--){
      //判断是否含有蒙层
      if(active_objs[i]._mask){
        var zIndex = getCSS(active_objs[i].dom,'zIndex');
        //是否为数值
        if(isNum(zIndex)){
          return parseInt(zIndex);
        }
      }
    }
    return private_config_zIndex; // 无则返回默认值
  }
  //调整正在显示的对象的位置
  var adapt_delay;
  function adapt_active_obj(){
    clearTimeout(adapt_delay);
    adapt_delay = setTimeout(function(){
      utils.each(active_objs,function(index,item){
        item.adaption && item.adaption();
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
//  utils.ready(function(){
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

    var rebuild_fn = isIE67 ? function(){
        refreshSize();
        adapt_active_obj();
        setCSS(private_maskDom,{
          marginTop : private_scrollTop
        });
      } : function(){
        refreshSize();
        adapt_active_obj();
      };
    if( !isIE67 ){
      setCSS(private_maskDom,{
        position : 'fixed',
        top : 0
      });
    }

    //监听浏览器缩放、滚屏事件
    bindEvent(window,'resize',rebuild_fn);
    bindEvent(window,'scroll',rebuild_fn);
//  });

  //限制位置区域的方法
  function fix_position( top, left, width, height ){
    var gap = private_config_gap;
    if( top < private_scrollTop + gap.top ){
      //屏幕上方
      top = private_scrollTop  + gap.top;
    }else if( top + height - private_scrollTop > private_winH - gap.bottom ) {
      //屏幕下方
      if(height > private_winH - gap.top - gap.bottom){
        //比屏幕高
        top = private_scrollTop + gap.top;
      }else{
        //比屏幕矮
        top = private_scrollTop + private_winH - height - gap.bottom;
      }
    }
    if( left < gap.left ){
      left =  gap.left;
    }else if( left + width > private_docW - gap.right ){
      left = private_docW - width - gap.right;
    }

    return {
      top : Math.ceil(top),
      left : Math.ceil(left)
    }
  }
  //为基类扩展自适应于页面的原型方法
  BaseClass.prototype.adaption = function( param, useAnimation ){
    param = param || {};
    // 默认使用动画
    useAnimation = typeof(useAnimation) == 'boolean' ? useAnimation : true;
    var dom = this.dom,
        width = outerWidth( dom ),
        height = outerHeight( dom ),
        top = (private_winH - height)/2 + private_scrollTop,
        left = (private_docW - width)/2,
        newPosition = fix_position( top, left, width, height ),
        useMethod =  useAnimation ? animation : setCSS;

    useMethod(dom,{
      top : isNum(param.top) ? param.top : Math.ceil(newPosition.top),
      left : isNum(param.left) ? param.left : Math.ceil(newPosition.left)
    }, 80 );
  };

  //增加确认方法
  function add_confirm( dom, param, destroy ){
    var callback = null,
        cancel = null,
        btns = ['\u786E\u8BA4','\u53D6\u6D88'];

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
    dom.appendChild( utils.createDom(this_html)[0] );

    //绑定事件，根据执行结果判断是否要关闭弹框
    bindEvent(dom,'click','.UI_pop_confirm_ok',function(){
      //点击确认按钮
      callback ? ((callback() != false) && destroy()) : destroy();
    });
    bindEvent(dom,'click','.UI_pop_confirm_cancel',function(){
      //点击取消按钮
      cancel ? ((cancel() != false) && destroy()) : destroy();
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
  var blur,
      removeBlur;
  if(utils.supports('-webkit-filter')){
    blur = function (){
      travelRootElements(function(dom){
        utils.addClass(dom,'UI-blur');
      });
      utils.fadeIn(private_maskDom,300);
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

    //之前蒙层未显示，显示蒙层
    if(lastHasMaskZindex == private_config_zIndex ){
      blur && blur();
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

    if(lastHasMaskZindex == private_config_zIndex){
      removeBlur && removeBlur();
      utils.fadeOut(private_maskDom,400);
    }
  }

  /**
   * 开场动画
   **/
  function openAnimation( animationClass ){
    var me = this;
    //向全局记录的对象内添加对象
    active_objs.push(me);

    //显示蒙层（内部判断是否显示）
    showMask.call(me);

    //非ie系列 且 有动画配置，显示效果
    if( !isIE678 && animationClass ){
      utils.addClass( me.dom, animationClass );
    }
  }

  /**
   * 处理对象关闭及结束动画
   */
  function closeAnimation(){
    var me = this,
        DOM = me.dom,
        animationClass = private_config_defaultAnimationClass[1];

    //从全局记录的对象内删除自己；
    remove_active_obj(me);

    // 关闭蒙层（内部判断是否关闭）
    closeMask.call(me);
    function end(){
      //删除dom
      utils.removeNode(DOM);
    }

    //ie系列或未配置动画class，立即结束
    if( isIE678 || !animationClass ){
      end();
    }else{
      utils.addClass( DOM, animationClass );
      setTimeout(end, 500);
    }
  }

  /**
   * 弹框
   * pop 
   */
  function POP(param){
    if(!(this instanceof POP)){
      return new POP(param);
    }
    param = param || {};
    var me = this,
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;

    me.dom = utils.createDom(pop_tpl)[0];
    me.cntDom = findByClassName(me.dom,'UI_cnt')[0];
    me._mask = param.mask || false;


    //当有确认参数时
    if(param.confirm){
      add_confirm(me.dom,param.confirm,function(){
        me.destroy();
      });
    }
    //处理title参数
    var caption_dom = findByClassName(me.dom,'UI_pop_cpt')[0];
    if(!param.title){
      utils.removeNode(caption_dom);
    }else{
      caption_dom.innerHTML = param.title;
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
      me.destroy();
    });

    //插入内容
    me.cntDom.innerHTML = param.html || '';

    //设置宽度，为计算位置尺寸做准备
    setCSS(me.dom,{
      width:  Math.min(param.width || 600,private_docW-20)
    });
    private_allCnt.appendChild(me.dom);

    //校正位置
    this.adaption( param, false );

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);

    //开场动画
    openAnimation.call( me, animationClass );
  }
  POP.prototype = new BaseClass({
    destroy: closeAnimation
  });

  /**
   * CONFIRM 
   */
  function CONFIRM(param){
    if(!(this instanceof CONFIRM)){
      return new CONFIRM(param);
    }
    param = param || {};
    var me = this,
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;

    var this_html = utils.render(confirm_tpl,{
      text : param.text || 'need text in parameter!'
    });
    me.dom = utils.createDom(this_html)[0];
    me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;

    add_confirm(me.dom,param,function(){
        me.destroy();
    });
    private_allCnt.appendChild(me.dom);

    this.adaption( param, false );

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me, animationClass );
  }
  CONFIRM.prototype = new BaseClass({
    destroy: closeAnimation
  });


  /**
   * ASK 
   */
  function ASK(text,callback,param){
    if(!(this instanceof ASK)){
      return new ASK(text,callback,param);
    }
    param = param || {};
    var me = this,
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;

    var this_html = utils.render(ask_tpl,{
      text : text || 'need text in parameter!'
    });

    me.dom = utils.createDom(this_html)[0];
    me._mask = typeof(param.mask) == 'boolean' ? param.mask : true;
    me.inputDom = findByClassName(me.dom,'UI_ask_key')[0];

    var confirm_html = utils.render(confirmBar_tpl,{
      confirm : '确定',
      cancel : '取消'
    });

    me.dom.appendChild(utils.createDom(confirm_html)[0]);

    //确定
    bindEvent(me.dom,'click','.UI_pop_confirm_ok',function(){
      //根据执行结果判断是否要关闭弹框
      callback ? ((callback(me.inputDom.value) != false) && me.destroy()) : me.destroy();
    });
    //取消
    bindEvent(me.dom,'click','.UI_pop_confirm_cancel',function(){
      me.destroy();
    });

    private_allCnt.appendChild(me.dom);

    this.adaption( param, false );

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me, animationClass );
    me.inputDom.focus();
  }
  ASK.prototype = new BaseClass({
    destroy: closeAnimation
  });
  ASK.prototype.setValue = function(text){
      this.inputDom.value = text.toString();
  };


  /**
   * prompt
   * 
   **/
  function PROMPT(text,time,param){
    if(!(this instanceof PROMPT)){
      return new PROMPT(text,time,param);
    }
    param = param || {};
    var me = this,
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;
    me.dom = utils.createDom(prompt_tpl)[0];
    me._mask = param.mask ? true : false;
    me.tips(text,time);

    // create pop
    private_allCnt.appendChild(me.dom);
    this.adaption( param, false );

    openAnimation.call( me, animationClass );
  }
  PROMPT.prototype = new BaseClass({
    destroy: closeAnimation
  });
  PROMPT.prototype.tips = function(txt,time){
    var me = this;
    if(txt){
      findByClassName(this.dom,'UI_cnt')[0].innerHTML = txt;
    }
    if(time != 0){
      setTimeout(function(){
        me.destroy();
      },(time || 1500));
    }
  };
  /**
   *	PLANE 
   */
  function PLANE(param){
    if(!(this instanceof PLANE)){
      return new PLANE(param);
    }
    var param = param || {};
    var me = this,
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;

    me.dom = utils.createDom(plane_tpl)[0];

    //insert html
    me.dom.innerHTML = param.html || '';

    setCSS(me.dom,{
      width : param.width || 240,
      height : param.height || null,
      top : isNum(param.top) ? param.top : 300,
      left : isNum(param.left) ? param.left : 800
    });
    private_allCnt.appendChild(me.dom);

    easyCloseHandle.call(me,true);
    openAnimation.call( me, animationClass );
  }
  PLANE.prototype = new BaseClass({
    destroy: closeAnimation
  });
  /***
   * 全屏弹框
   * COVER 
   */
  function COVER(param){
    if(!(this instanceof COVER)){
      return new COVER(param);
    }
    param = param || {};
    var me = this,
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;
    me.dom = utils.createDom(cover_tpl)[0];
    me._mask = typeof(param.mask) == 'boolean' ? param.mask : false;

    me.cntDom = findByClassName(me.dom,'UI_cnt')[0];


    //关闭事件
    bindEvent(me.dom,'click','.UI_close',function(){
      me.destroy();
    });


    //记录body的scrollY设置

    setCSS(me.dom,{
      height: private_winH,
      top: private_scrollTop
    });
    private_allCnt.appendChild(me.dom);

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me, animationClass );
    utils.addClass( private_body, 'UI-noscroll' );
    //insert html
    me.cntDom.innerHTML = param.html || '';

    me.on('destroy',function(){
      utils.addClass( me.cntDom, 'UI-noscroll' );
      utils.removeClass( private_body, 'UI-noscroll' );
    });
  }
  //使用close方法
  COVER.prototype = new BaseClass({
    destroy: closeAnimation
  });
  /**
   * 选择功能
   */
  function SELECT(list,param){
    if(!(this instanceof SELECT)){
      return new SELECT(list,param);
    }
    param = param || {};
    var me = this,
        list = list || [],
        fns = [],
        nameList = [],
        animationClass = param.animationClass || private_config_defaultAnimationClass[0] || null;

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
    me._mask = private_docW > 640 ? param.mask : true;

    //绑定事件
    var btns = findByClassName(me.dom,'UI_select_btn');
    utils.each(btns,function(index,btn){
      bindEvent(btn,'click',function(){
        fns[index] && fns[index]();
        me.destroy();
      });
    });

    if(private_docW < 640 && !isIE678){
      //手机版
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
    openAnimation.call( me, animationClass );
  }
  SELECT.prototype = new BaseClass({
    destroy: closeAnimation
  });
  /**
   *  抛出对外接口
   */
  return {
    pop : POP,
    config : {
      gap : function(name,value){
        //name符合top/right/bottom/left,且value值为数字类型（兼容字符类型）
        if(name && typeof(private_config_gap[name]) == 'number' && isNum(value)){
            private_config_gap[name] = parseInt(value);
        }
      },
      setDefaultAnimationClass: function( startClassStr, endClassStr ){
        private_config_defaultAnimationClass[0] = startClassStr;
        endClassStr && (private_config_defaultAnimationClass[1] = endClassStr);
      },
      zIndex : function(num){
        var num = parseInt(num);
        if(num > 0){
          private_config_zIndex = num;
          setCSS(private_allCnt,{
            zIndex : num
          });
        }
      }
    },
    confirm : CONFIRM,
    ask : ASK,
    prompt : PROMPT,
    plane : PLANE,
    cover : COVER,
    select : SELECT
  };
}, function(){
	function isFunction( input ){
		return typeof( input ) === 'function'
	}
	function isNotEmptyString( input ){
		return typeof( input ) === 'string' && input.length > 0
	}


	function BaseClass( param ){
		if( !param || !isFunction( param.destroy ) ){
	      throw new Error("use BaseClass must define param & param.destroy");
		}
		param = param || {};
		this._events = {};
		this._isDestroyed = false;
		this._onDestroy = param.destroy;
	}
	BaseClass.prototype = {
		//监听自定义事件
		on: function( eventName, callback ){
			if( isNotEmptyString( eventName ) && isFunction( callback ) ){
				//事件堆无该事件，创建一个事件堆
				this._events[eventName] = this._events[eventName] || [];
				// 追加至事件列表
				this._events[eventName].push( callback );
			}
			//提供链式调用的支持
			return this;
		},
		//解除自定义事件监听
		un: function( eventName, callback ){
			var eventList = this._events[eventName];
			//事件堆无该事件队列，或未传入事件名结束运行
			if( !eventList || !isNotEmptyString( eventName ) ){
				return
			}
			// 若未传入回调参数，则直接置空事件队列
			if( !isFunction( callback ) ){
				eventList = [];
			}else{
				// 逆序遍历事件队列
				for( var i = eventList.length-1; i!=-1; i-- ){
					// 回调相同，移除当前项
					if( eventList[i] == callback ){
						eventList.splice(i,1);
					}
				}
			}
			//提供链式调用的支持
			return this;
		},
		// 主动触发自定义事件
		emit: function( eventName ){
			// 获取除了事件名之外的参数
			var args = Array.prototype.slice.call( arguments, 1, arguments.length );
			//事件堆无该事件，结束运行
			if(!this._events[eventName]){
				return
			}
			for(var i=0,total=this._events[eventName].length;i<total;i++){
				this._events[eventName][i].apply( this, args );
			}
		},
		// 保证只有一遍有效执行
		destroy: function(){
			if( this._isDestroyed ){
				return;
			}
			this._isDestroyed = true;
			this._onDestroy.call( this );
			this.emit( 'destroy' );
		}
	};
	return BaseClass;
}, function (window,document) {
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

  /**
   * class 操作
   */
  var private_css3 = !!(supports('transition') && supports('transform')),
      supports_classList = !!document.createElement('div').classList,
      // 是否含有某个 class
      hasClass = supports_classList ? function( node, classSingle ){
        return node && node.classList && node.classList.contains( classSingle );
      } : function ( node, classSingle ){
        if( !node || typeof( node.className ) !== 'string'  ){
          return false;
        }
        return !! node.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)'));
      },
      // 增加一个 class
      addClass = supports_classList ? function( node, classSingle ){
        node && node.classList && node.classList.add( classSingle );
      } : function ( node, cls) {
        !hasClass(node, cls) && ( node.className += " " + cls );
      },
      // 移除一个 class
      removeClass = supports_classList ? function ( node, classSingle ) {
        node && node.classList && node.classList.remove( classSingle );  
      } : function ( node, classSingle ) {
        if ( hasClass( node, classSingle ) ) {
          node.className = node.className.replace( new RegExp('(\\s+|^)' + classSingle + '(\\s+|$)'), '' );
        }
      };
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
        transition: durtime + 'ms ' + animType
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
          transition: transition_start || 'all 0s'
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
  var isSupportGBCR = !!document.createElement('div').getBoundingClientRect,
      //用生命在计算宽度
      count_outerWidth = function ( node ){
        return (getStyle(node,'borderLeftWidth') + getStyle(node,'paddingLeft') + getStyle(node,'width') + getStyle(node,'paddingRight') + getStyle(node,'borderRightWidth'));
      },
      //用生命在计算高度
      count_outerHeight = function ( node ){
        return (getStyle(node,'borderTopWidth') + getStyle(node,'paddingTop') + getStyle(node,'height') + getStyle(node,'paddingBottom') + getStyle(node,'borderBottomWidth'));
      },
      // 外部宽度
      outerWidth = isSupportGBCR ? function( node ){
        var output = node.getBoundingClientRect().width;
        return typeof(output) == 'number' ? output : count_outerWidth( node );
      } : count_outerWidth,
      // 外部高度
      outerHeight = isSupportGBCR ? function( node ){
        var output = node.getBoundingClientRect().height;
        return typeof(output) == 'number' ? output : count_outerHeight( node );
      } : count_outerHeight;

  var supportEventListener = !!window.addEventListener,
    /**
     * 事件绑定
     * elem:节点
     * type:事件类型
     * handler:回调
     */
    bindHandler = supportEventListener ? function(elem, type, handler) {
      // 最后一个参数为true:在捕获阶段调用事件处理程序
      //为false:在冒泡阶段调用事件处理程序
      elem.addEventListener(type, handler, false);
    } : function(elem, type, handler) {
        elem.attachEvent("on" + type, handler);
    },
    /**
     * 事件解除
     * elem:节点
     * type:事件类型
     * handler:回调
     */
    removeHandler = supportEventListener ? function(elem, type, handler) {
      elem.removeEventListener(type, handler, false);
    } : function(elem, type, handler) {
      elem.detachEvent("on" + type, handler);
    };

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
    addClass : addClass,
    removeClass : removeClass,
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
        opacity: 0,
        display: 'block'
      });
      animation(DOM,{
        opacity: op
      }, time, function(){
        fn && fn.call(DOM);
      });
    },
    //淡出
    fadeOut : function (DOM,time,fn){
      var op = getStyle(DOM,'opacity');
      animation(DOM,{
        opacity: 0
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
