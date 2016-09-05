define(function(){
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
});