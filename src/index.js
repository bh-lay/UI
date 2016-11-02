/**
 * @author bh-lay
 * 
 * @github https://github.com/bh-lay/UI
 * @modified requires('Date')
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
  var allCnt_tpl = requires('template/base.html'),
      pop_tpl = requires('template/pop.html'),
      confirm_tpl = requires('template/confirm.html'),
      ask_tpl = requires('template/ask.html'),
      confirmBar_tpl = requires('template/confirmBar.html'),
      prompt_tpl = requires('template/prompt.html'),
      cover_tpl = requires('template/cover.html'),
      plane_tpl = requires('template/plane.html'),
      select_tpl = requires('template/select.html'),
      popCSS = requires('style.css');

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
      private_root_node = document.compatMode == "BackCompat" ? private_body : document.documentElement,
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

//重新计算浏览器窗口尺寸
  function refreshSize(){
    private_scrollTop = private_root_node.scrollTop == 0 ? private_body.scrollTop : private_root_node.scrollTop;
    private_winH = window.innerHeight || document.documentElement.clientHeight;
    private_winW = window.innerWidth || document.documentElement.clientWidth;
    private_docH = private_root_node.scrollHeight;
    private_docW = private_root_node.clientWidth;
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
        active_objs[i].destroy && active_objs[i].destroy();
        break;
      }
    }
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
      utils.addClass( me.node, 'UI_easyClose' );
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

    var rebuild_fn = isIE67 ? function(){
        refreshSize();
        adapt_active_obj();
        setCSS(private_maskDom,{
          height: private_docH
        });
      } : function(){
        refreshSize();
        adapt_active_obj();
      };
    if( isIE67 ){
      utils.addClass(private_allCnt,'UI_ie67');
    }
    if(isIE678){
      utils.addClass(private_allCnt,'UI_ie678');
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
  //为基类扩展自适应于页面位置的原型方法
  BaseClass.prototype.adaption = function(){
    
    var initTop,
        initLeft,
        useMethod = animation,
        initPosition = this._initPosition;

    if( initPosition ){
      initTop = initPosition.top;
      initLeft = initPosition.left;
      // 初始时不使用动画
      useMethod = setCSS;
      // 删除初始位置
      delete this._initPosition;
    }
    var node = this.node,
        width = outerWidth( node ),
        height = outerHeight( node ),
        top = isNum(initTop) ? initTop : (private_winH - height)/2 + private_scrollTop,
        left = isNum(initLeft) ? initLeft : (private_docW - width)/2,
        newPosition = fix_position( top, left, width, height );

    useMethod( node, {
      top : Math.ceil(newPosition.top),
      left : Math.ceil(newPosition.left)
    }, 80 );
  };

  //增加确认方法
  function add_confirm( confirmParams ){
    var me = this,
        callback = null,
        cancel = null,
        btns = ['\u786E\u8BA4','\u53D6\u6D88'],
        node = me.node;

    if(typeof( confirmParams ) == "function"){
      callback = confirmParams;
    }else if(typeof( confirmParams ) == "object"){
      var paramBtns = confirmParams.btns || [];
      btns[0] = paramBtns[0] || btns[0];
      btns[1] = paramBtns[1] || btns[1];
      if(typeof(confirmParams.callback) == "function"){
        callback = confirmParams.callback;
      }
      if( typeof(confirmParams.cancel) == "function" ){
        cancel = confirmParams.cancel;
      }
    }
    var this_html = utils.render(confirmBar_tpl,{
      confirm : btns[0],
      cancel : btns[1]
    });
    node.appendChild( utils.createDom(this_html)[0] );
    // 关闭弹窗的方法
    function close(){
      me.destroy();
    }
    //绑定事件，根据执行结果判断是否要关闭弹框
    bindEvent( node, 'click','.UI_pop_confirm_ok', function(){
      //点击确认按钮
      callback ? ((callback() !== false) && close()) : close();
    });
    bindEvent( node, 'click','.UI_pop_confirm_cancel',function(){
      //点击取消按钮
      cancel ? ((cancel() !== false) && close()) : close();
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
    };
    removeBlur = function (){
      travelRootElements(function(dom){
        utils.removeClass(dom,'UI-blur');
      });
    };
  }

  //最后一个有蒙层的对象
  function last_has_mask_item(){
    //逆序遍历所有显示中的对象
    for(var i= active_objs.length-1;i>=0;i--){
      //判断是否含有蒙层
      if(active_objs[i]._mask){
        return active_objs[i];
      }
    }
    return null;
  }
  //最后一个有蒙层的对象的zIndex值，
  function last_has_mask_zIndex(){
    var item = last_has_mask_item();
    return item ? item._zIndex : private_config_zIndex; // 无则返回默认值
  }
  /**
   * 开场动画
   **/
  function openAnimation(){
    var me = this,
        lastHasMaskZindex = last_has_mask_zIndex();

    me._zIndex = lastHasMaskZindex + 2;
    setCSS( me.node, {
      zIndex: me._zIndex
    });

    // 若有蒙层则显示蒙层
    if( me._mask ){
      setCSS(private_maskDom,{
        zIndex: lastHasMaskZindex + 1
      });

      //之前蒙层未显示，显示蒙层
      if( lastHasMaskZindex <= private_config_zIndex ){
        blur && blur();
        utils.fadeIn(private_maskDom,300);
      }
    }

    //向全局记录的对象内添加对象
    active_objs.push( me );
    //非ie系列 且 有动画配置，显示效果
    if( !isIE678 && me.animationClass ){
      utils.addClass( me.node, me.animationClass[0] );
    }
  }

  /**
   * 处理对象关闭及结束动画
   */
  function closeAnimation(){
    var me = this,
        DOM = me.node,
        animationClass = me.animationClass[1];

    //从全局记录的对象内删除自己；
    remove_active_obj(me);

    // 若有蒙层，则关闭或移至下一个需要显示蒙层的位置
    if( me._mask ){
      var lastHasMaskZindex = last_has_mask_zIndex();
      setCSS(private_maskDom,{
        zIndex : lastHasMaskZindex - 1
      });

      if(lastHasMaskZindex <= private_config_zIndex){
        removeBlur && removeBlur();
        utils.fadeOut(private_maskDom,400);
      }
    }
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
  // 过滤参数
  function filterParam( param, defaults ){
    param = param || {};
    // 动画定义
    this.animationClass = ( param.animationClass || '' ).constructor == Array ? param.animationClass : private_config_defaultAnimationClass;
    // 蒙层参数
    this._mask = typeof( param.mask ) == 'boolean' ? param.mask : defaults.mask;
    // 初始位置
    this._initPosition = {
      top: param.top,
      left: param.left
    };
  }
  /**
   * 弹框
   * pop 
   */
  function POP( param ){
    if( !(this instanceof POP) ){
      return new POP( param );
    }
    param = param || {};
    var me = this;
    filterParam.call( me, param, {
      mask: true
    });
    me.node = utils.createDom( utils.render( pop_tpl, {
      title: param.title
    }) )[0];
    me.cntDom = findByClassName( me.node, 'UI_cnt' )[0];

    //当有确认参数时
    if(param.confirm){
      add_confirm.call( me, param.confirm );
    }
    //处理title参数
    if( param.title ){
      //can drag is pop
      utils.drag( findByClassName( me.node, 'UI_pop_cpt' )[0], me.node, {
        move : function( mx, my, l_start, t_start, w_start, h_start ){
          var left = mx + l_start,
              top = my + t_start,
              newSize = fix_position( top, left, w_start, h_start );
          setCSS( me.node, {
            left : newSize.left,
            top : newSize.top
          });
        }
      });
    }

    bindEvent( me.node, 'click', '.UI_pop_close', function(){
      me.destroy();
    });

    //插入内容
    me.cntDom.innerHTML = param.html || '';

    //设置宽度，为计算位置尺寸做准备
    setCSS( me.node, {
      width:  Math.min(param.width || 600,private_docW-20)
    });
    private_allCnt.appendChild( me.node );

    //校正位置
    me.adaption();

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);

    //开场动画
    openAnimation.call( me );
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
    var me = this;
    filterParam.call( me, param, {
      mask: true
    });
    me.node = utils.createDom( utils.render(confirm_tpl,{
      text : param.text || 'need text in parameter!'
    }) )[0];

    add_confirm.call( me, param );
    private_allCnt.appendChild( me.node );

    me.adaption();

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me );
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
    var me = this;
    filterParam.call( me, param, {
      mask: true
    });

    var this_html = utils.render(ask_tpl,{
      text : text || 'need text in parameter!'
    });

    me.node = utils.createDom(this_html)[0];

    me.inputDom = findByClassName( me.node, 'UI_ask_key' )[0];

    var confirm_html = utils.render(confirmBar_tpl,{
      confirm : '确定',
      cancel : '取消'
    });

    me.node.appendChild(utils.createDom(confirm_html)[0]);

    //确定
    bindEvent( me.node, 'click', '.UI_pop_confirm_ok', function(){
      //根据执行结果判断是否要关闭弹框
      callback ? ((callback(me.inputDom.value) != false) && me.destroy()) : me.destroy();
    });
    //取消
    bindEvent( me.node, 'click', '.UI_pop_confirm_cancel', function(){
      me.destroy();
    });

    private_allCnt.appendChild( me.node );

    me.adaption();

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me );
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
    var me = this;
    filterParam.call( me, param, {
      mask: false
    });
    me.node = utils.createDom(prompt_tpl)[0];
    me.tips(text,time);

    // create pop
    private_allCnt.appendChild( me.node );
    me.adaption();

    openAnimation.call( me );
  }
  PROMPT.prototype = new BaseClass({
    destroy: closeAnimation
  });
  PROMPT.prototype.tips = function(txt,time){
    var me = this;
    if(txt){
      findByClassName( me.node, 'UI_cnt' )[0].innerHTML = txt;
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
    param = param || {};
    var me = this;
    filterParam.call( me, param, {
      mask: false
    });

    me.node = utils.createDom(plane_tpl)[0];

    //insert html
    me.node.innerHTML = param.html || '';

    setCSS( me.node, {
      width : param.width || 240,
      height : param.height || null,
      top : isNum(param.top) ? param.top : 300,
      left : isNum(param.left) ? param.left : 800
    });
    private_allCnt.appendChild( me.node );

    easyCloseHandle.call(me,true);
    openAnimation.call( me );
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
    var me = this;
    filterParam.call( me, param, {
      mask: false
    });
    me.node = utils.createDom(cover_tpl)[0];

    me.cntDom = findByClassName(me.node,'UI_cnt')[0];


    //关闭事件
    bindEvent(me.node,'click','.UI_close',function(){
      me.destroy();
    });


    //记录body的scrollY设置

    setCSS( me.node, {
      height: private_winH,
      top: private_scrollTop
    });
    private_allCnt.appendChild( me.node );

    //处理是否易于关闭
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me );
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
        nameList = [];
    filterParam.call( me, param, {
      mask: true
    });

    utils.each(list,function(i,item){
      nameList.push(item[0]);
      fns.push(item[1]);
    });
    var this_html = utils.render(select_tpl,{
      list : nameList,
      title : param.title || null,
      intro : param.intro || null
    });

    me.node = utils.createDom(this_html)[0];

    //绑定事件
    var btns = findByClassName( me.node, 'UI_select_btn' );
    utils.each(btns,function(index,btn){
      bindEvent(btn,'click',function(){
        fns[index] && fns[index]();
        me.destroy();
      });
    });

    if(private_docW < 640 && !isIE678){
      //手机版
      private_allCnt.appendChild( me.node );
    }else{
      var cssObj = {
        top : param.top || 100,
        left : param.left || 100,
        width : param.width || 200
      };
      private_allCnt.appendChild( me.node );

      setCSS( me.node, cssObj );
      var newSize = fix_position( cssObj.top, cssObj.left, cssObj.width, outerHeight( me.node ) );
      setCSS( me.node, {
        left : newSize.left,
        top : newSize.top
      });
    }
    easyCloseHandle.call(me,param.easyClose,true);
    openAnimation.call( me );
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
}, requires('BaseClass.js'), requires('utils.js'));
