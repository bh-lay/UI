var fs = require('fs');

function getStyleSheet(src,moduleName){
	var cssStr = fs.readFileSync(src,'UTF-8')
	
	//过滤注释
	var txt = cssStr.replace(/\\*.+\*\//g,'');
	//过滤换行
	var txt = txt.replace(/\r|\n/g,'');
	//过滤连续空格
	txt = txt.replace(/\s+/g,' ');
	//过滤不必要的空格
	txt = txt.replace(/\s*{\s*/g,'{');
	txt = txt.replace(/\s*}\s*/g,'}');
	txt = txt.replace(/\s*;\s*/g,';');
	
	txt = '<style type="text/css" data-module="' + moduleName + '">' + txt + '</style>';
	return txt;
}

function getJS(src){
	var JsStr = fs.readFileSync(src,'UTF-8')
	return JsStr;
}

function getTemplate(src){
	var tmp = fs.readFileSync(src,'UTF-8')
	//过滤换行
	var tmp = tmp.replace(/\r|\n/g,'');
	//过滤连续空格
	tmp = tmp.replace(/\s+/g,' ');
	//过滤标签间的空格
	tmp = tmp.replace(/\>\s+\</g,'><');
	tmp = "'" + tmp + "'";
	return tmp;
}



function checkMainFiles(src){
	var str = fs.readFileSync(src,'UTF-8');
	str = str.replace(/require\(((?:\,|\s|\w|\.|\'|\")+)\)/g,function(a,b){
		//过滤无意义的空格
		b = b.replace(/\s*\,\s*/g,',');
		//过滤引号
		b = b.replace(/\'|\"/g,'');
		
		//获取参数
		var args = b.split(/\,/g);
		
		console.log('find require',args);
		
		//判断资源类型
		if(args[0].match(/\.css$/)){
			console.log('loading and min css');
			return "'" + getStyleSheet(args[0],args[1] || '') + "'";
		}else if(args[0].match(/\.js$/)){
			console.log('loading js');
			return getJS(args[0]);
		}else if(args[0].match(/\.html$/)){
			console.log('loading template');
			return getTemplate(args[0]);
		}
	});
	
	console.log('build content over');
	return str;
}

function write(src,str){
	fs.writeFileSync(src,str);
}
//var txt = getStyleSheet('style.css','UI');
//var txt = getJS('utils.js');
//
//

var newContent = checkMainFiles('index.js');
write('dialog.js',newContent);
console.log('successful');