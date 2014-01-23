#简介

##这个UI是什么?
剧中人在个人博客以及项目中反复使用的功能的公用视觉类的代码集合，

不是一个大而全的东西，仅仅是根据自己的需求整理，如果你对我的代码感兴趣，也欢迎你来使用！

##UI目前有哪儿些内容？

* 目前有虚拟弹层、弹框、提示框、确认框等功能
* 支持对象化事件的调用
* 支持窗体自由`拖拽`
* 支持`自定义位置`，方便控制对象在页面中的呈现
* 对象被注销有`回调支持`，方便确认对象

##问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件：bh-lay#126.com, 把#换成@
* QQ：279708284
* weibo: [@剧中人](http://weibo.com/bhlay)


##感激
前端路上的成长，离不开精神上的导师以及生活上的好基友

* [Z_Mofei](http://weibo.com/zwl1027) 
* [-筱-傑-](http://weibo.com/bbllii)
* [打杂工程师](http://weibo.com/zosong)

##说明
*细节实现依赖于[jquery](http://jquery.com)

##关于作者

```javascript
  var ihubo = {
    nickName  : "剧中人",
    site : "http://bh-lay.com/"
  }
```

#使用


## 弹出框组件 @method UI.pop
### 传入参数
 * @param {Object} param the main paramter
 * @param {String} param.title 弹框标题
 * @param {String} param.html 弹框内容
 * @param {String} [param.width] 弹框宽度
 * @param {String} [param.height] 弹框高度
 * @param {String} [param.top] 弹框与页面顶部距离
 * @param {String} [param.left] 弹框与页面左侧距离
 * @param {String} [param.mask] 是否显示蒙层
 * @param {Function} [param.closeFn] 弹框关闭时的回调
 * @param {Function} [param.closeFn]
 * @param {Object|Function} [param.confirm] 使用对话方式（详细定义或只定义回调）
 * @param {Array} [param.confirm.btns] 按钮自定义名称
 * @param {Array} [param.confirm.callback] 确定时的回调方法

### 返回值
 * @returns {Object} pop
 * @returns {String} pop.title 弹框标题
 * @returns {Object} pop.dom 弹框所属DOM
 * @returns {Object} pop.cntDom 弹框内容部分DOM
 * @returns {Function} pop.close 关闭弹框的方法
 * @returns {Function} pop.closeFn 弹框关闭时的回调
 
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

## 确认对话框 @method UI.confirm
### 传入参数
 * 	@param {Object} param the main paramter
 * 	@param {String} param.text 提示内容
 * 	@param {Function} [param.closeFn] 关闭时的回调
 * 	@param {Function} [param.closeFn]
 * 	@param {Array} [param.btns] 按钮自定义名称
 * 	@param {Array} [param.callback] 确定时的回调方法

### 返回值
 * 	@returns {Object} confirm
 * 	@returns {Object} confirm.dom 弹框所属DOM
 * 	@returns {Function} confirm.close 关闭弹框的方法
 * 	@returns {Function} confirm.closeFn 弹框关闭时的回调

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

## 虚拟弹层 @method UI.plane
 `特性`：没有样式，页面中只能同时存在一个plane实例化后的对象，点击自己以外的DOM，就会关掉自己，生命体征较弱的屌丝。
### 传入参数
 * 	@param {Object} param the main paramter
 * 	@param {String} param.html
 * 	@param {String} [param.width]
 * 	@param {String} [param.height]
 * 	@param {String} [param.top]
 * 	@param {String} [param.left]
 * 	@param {Function} [param.closeFn]

### 返回值
 * 	@returns {Object} plane
 * 	@returns {Object} plane.dom
 * 	@returns {Function} plane.closeFn

## 提示信息 @method UI.prompt
###传入参数
 * 	@param {String} text
 * 	@param {String|Number} [time]
