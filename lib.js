if(self.Lib == undefined){
	Lib = new Object;
}

(function(){
	var gTouchDevice = false;
	
	function set_user_agent(){
		if(window.ontouchstart){
			gTouchDevice = true;
		}
	}
	
	function clone_object(obj){
		var ret = {};
		for(var name in obj){
			ret[name] = obj[name];
		}
		return ret;
	}
	
	function to_px(val){
		if(val > 0.1){
			return "" + Math.floor(val) + "px";
		}else if(val < -0.1){
			return "-" + Math.floor(-val) + "px";
		}else{
			return "0px";
		}
	}
	
	var gDebgugWindow = null;

	function arguments_to_message(args){
		var message = "";
		if(args.length > 0){
			message = args[0];
			for(var i = 1; i < args.length; i ++){
				message += "," + args[i];
			}
		}
		return message;
	}
	
	function debug_output(){
		var message = arguments_to_message(arguments);
		var p_element = document.createElement("p");
		p_element.appendChild(document.createTextNode(message));

		var debug_window_div = document.getElementById("debug_window");
		if(debug_window_div){
			debug_window_div.appendChild(p_element);
		}else{
			if(gDebgugWindow == null){
				var div = document.createElement("div");
				div.style.position = "absolute";
				div.style.borderStyle = "solid";
				div.style.borderColor = "black";
				div.style.borderWidth = "2px";
				div.style.padding = "0px";
				div.style.backgroundColor = "white";
				div.style.color = "black";
				div.style.fontSize = "small";
				div.style.fontFamily = "monospace";
				
				document.body.appendChild(div);
				
				gDebgugWindow = div;
			}
			p_element.style.border = "0px";
			p_element.style.margin = "0px";
			p_element.style.padding = "0px";
			p_element.style.textIndent = "0px";
			gDebgugWindow.style.top = to_px(document.documentElement.scrollTop);
			if(gDebgugWindow.firstChild != null){
				gDebgugWindow.insertBefore(p_element,gDebgugWindow.firstChild);
			}else{
				gDebgugWindow.appendChild(p_element);
			}
		}
	}

	function info_output(){
		var message = arguments_to_message(arguments);
		var p_element = document.createElement("p");
		p_element.appendChild(document.createTextNode(message));
		var info_div = document.getElementById("info");
		if(info_div){
			info_div.appendChild(p_element);
		}else{
			document.body.appendChild(p_element);
		}
	}
	
	function do_nothing(){
	}
	
	function create_on_load_handler(handler){
		var initialized = false;
		return function(){
			if(initialized){
				return;
			}
			initialized = true;
			handler();
		}
	}
	
	function execute_on_dom_load(handler){
		if(document.body && document.body.readyState == "complete"){
			handler();
		}else{
			var func = create_on_load_handler(handler);
			document.addEventListener("DOMContentLoaded", func, false);
		}
	}

	function execute_on_load(handler){
		if(document.body && document.body.readyState == "complete"){
			handler();
		}else{
			var func = create_on_load_handler(handler);
			document.addEventListener("DOMContentLoaded", func, false);
			document.addEventListener("load", func, false);
		}
	}
	
	set_user_agent();
	
	Lib.do_nothing          = do_nothing;
	Lib.to_px               = to_px;
	Lib.debug_output        = debug_output;
	Lib.info_output         = info_output;
	Lib.execute_on_load     = execute_on_load;
	Lib.execute_on_dom_load = execute_on_dom_load;
	Lib.clone_object        = clone_object;
	Lib.is_touch_device     = gTouchDevice;
})();


