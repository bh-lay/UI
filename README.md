#一、简介

##1.1、UI是什么?
此处UI意为：user interface 和 user interaction

剧中人在个人博客以及项目中反复使用的功能的公用视觉类的代码集合

不是一个大而全的东西，仅仅是根据自己的需求整理，如果你对我的代码感兴趣，也欢迎你来使用！

你可以先尝试体验下：[demo](http://htmlpreview.github.io/?https://github.com/bh-lay/UI/blob/master/demo.html)

##1.2、UI目前有哪儿些内容？

* 目前有虚拟弹层、弹框、提示框、确认框等功能
* 支持对象化事件的调用
* 支持窗体自由`拖拽`
* 支持`自定义位置`，方便控制对象在页面中的呈现
* 对象被注销有`回调支持`，方便确认对象

##1.3、问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件：bh-lay#126.com, 把#换成@
* QQ：279708284
* weibo: [@剧中人](http://weibo.com/bhlay)

##1.4、说明
*细节实现依赖于[jquery](http://jquery.com)

##1.5、关于作者

```javascript
  var bh_lay = {
    nickName  : "剧中人",
    site : "http://bh-lay.com/"
  }
```

#二、使用

## 2.0 基本配置

### 2.0.1 UI.config.gap
为pop弹框配置页面显示的边界，可用在弹框展开时与拖动处理时限定自身位置。
 
 * @param {String} name 设置边界名（top/right/bottom/left）
 * @param {Number} vlue 设置边界尺寸

### 2.0.2 UI.config.zIndex
全局设置弹框交互在页面中的层级

###demo
```javascript
//设置边界
UI.config.gap('top',100);
//设置层级
UI.config.zIndex(5000);
```

### 传入参数

 * @param {String} name 设置边界名（top/right/bottom/left）
 * @param {Number} vlue 设置边界尺寸

## 2.1、弹出框组件 @method UI.pop
### 传入参数@param 
 * {Object} param the main paramter
 * {String} param.title 弹框标题
 * {String} param.html 弹框内容
 * {String} [param.width] 弹框宽度
 * {String} [param.height] 弹框高度
 * {String} [param.top] 弹框与页面顶部距离
 * {String} [param.left] 弹框与页面左侧距离
 * {String} [param.mask] 是否显示蒙层
 * {Function} [param.closeFn] 弹框关闭时的回调
 * {Object|Function} [param.confirm] 使用对话方式（详细定义或只定义回调）
 * {Array} [param.confirm.btns] 按钮自定义名称
 * {Function} [param.confirm.callback] 确定时的回调方法

### 返回值@returns
 * {Object} pop
 * {String} pop.title 弹框标题
 * {Object} pop.dom 弹框所属DOM
 * {Object} pop.cntDom 弹框内容部分DOM
 * {Function} pop.close 关闭弹框的方法
 * {Function} pop.closeFn 弹框关闭时的回调
 
###demo
```javascript
var pop = UI.pop({
  'title' : '我的弹框',
  'top' : 200,
  'left' : '600',
  'html' : 'this is html'
});
UI.pop({
  'title' : '我是自定义按钮的弹框',
  'confirm' : {
    'btns' : ['好的','不干'],
    'callback' : function(){
      alert(1);
    }
  },
//  'confirm' : function(){
//    alert(2);
//  }
});
```
 
## 2.2、确认对话框 @method UI.confirm
### 传入参数@param 
 * {Object} param the main paramter
 * {String} param.text 提示内容
 * {Function} [param.closeFn] 关闭时的回调
 * {Array} [param.btns] 按钮自定义名称
 * {Function} [param.callback] 确定时的回调方法

### 返回值@returns
 *  {Object} confirm
 * 	{Object} confirm.dom 弹框所属DOM
 * 	{Function} confirm.close 关闭弹框的方法
 * 	{Function} confirm.closeFn 弹框关闭时的回调

###demo
```javascript
UI.confirm({
  'text' : '请我吃饭吧！',
  'btns' : ['好的呀','不愿意'],
  'callback' : function(){
    alert('你是好人！');
  }
});
```

## 2.3、虚拟弹层 @method UI.plane
 `特性`：没有样式，页面中只能同时存在一个plane实例化后的对象，点击自己以外的DOM，就会关掉自己，生命体征较弱的屌丝。
### 传入参数@param
 * {Object} param the main paramter
 * {String} param.html
 * {String} [param.width]
 * {String} [param.height]
 * {String} [param.top]
 * {String} [param.left]
 * {Function} [param.closeFn]

### 返回值@returns 
 * {Object} plane
 * {Object} plane.dom
 * {Function} plane.closeFn

## 2.4、提示信息 @method UI.prompt
###传入参数@param
 * {String} text
 * {String|Number} [time] 默认为1300ms，0为不自动关闭

### 返回值@returns
 * {Object} prompt
 * {Object} prompt.dom prompt所属DOM
 * {Function} prompt.tips 为prompt设置内容
 * {Function} confirm.close 关闭prompt

###demo
```javascript
//默认时间
    P.prompt('操作失败');
//指定时间
    P.prompt('操作失败',2400);
//主动控制
    var a = P.prompt('正在发送',0);
    a.tips('发送成功');
    a.close()
```
