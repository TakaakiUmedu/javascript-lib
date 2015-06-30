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
	
	function get_element_by_id(element, id){
		if(element.getElementById){
			return element.getElementById(id);
		}else{
			return get_element_by_id_recursive(element, id);
		}
	}
	function get_element_by_id_recursive(element, id){
		if(element && element.nodeName != "#text"){
			if(element.nodeName[0] != "#" && element.nodeName != "html" && element.getAttribute("id") == id){
				return element
			}
			var child = element.firstChild;
			while(child){
				var ret = get_element_by_id_recursive(child, id);
				if(ret){
					return ret;
				}
				child = child.nextSibling;
			}
		}
		return null;
	}
	
	function to_px(val){
		if(val > 0.1){
			return "" + Math.floor(val) + "px";
		}else{
			return "0px";
		}
	}
	function to_px_m(val){
		return "" + Math.floor(val) + "px";
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
			gDebgugWindow.style.top = to_px(get_scroll_top());
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
	
	Lib.GetElementById   = get_element_by_id;
	Lib.ToPx             = to_px;
	Lib.ToPxM            = to_px_m;
	Lib.DebugOutput      = debug_output;
	Lib.InfoOutput       = info_output;
	Lib.ExecuteOnLoad    = execute_on_load;
	Lib.ExecuteOnDomLoad = execute_on_dom_load;
	Lib.CloneObject      = clone_object;
	Lib.IsTouchDevice    = gTouchDevice;
})();


