
if(self.Lib == undefined){
	Lib = new Object();
}

(function(){
	function elem(name, attributes){
		var element = document.createElement(name);
		if(attributes != null){
			for(var a_name in attributes){
				if(a_name == "style"){
					var style = attributes[a_name]
					for(var s_name in style){
						element.style[s_name] = style[s_name];
					}
				}else{
					element[a_name] = attributes[a_name];
				}
			}
		}
		if(arguments.length > 2){
			for(var i = 2; i < arguments.length; i ++){
				add(element, arguments[i]);
			}
		}
		return element;
	}
	function text(str){
		return document.createTextNode(str);
	}
	function add(element){
		for(var i = 1; i < arguments.length; i ++){
			var item = arguments[i];
			if(item != null){
				if(typeof(item) == "string" || typeof(item) == "number"){
					item = text(item);
				}
				element.appendChild(item);
			}
		}
	}
	
	function clear(element){
		var c;
		while(c = element.firstChild){
			element.removeChild(c);
		}
	}
	
	Lib.Dom = {
		elem: elem,
		text: text,
		add: add,
		clear: clear,
	}
	
})();
