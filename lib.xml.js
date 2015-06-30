if(self.Lib == undefined){
	Lib = new Object();
}

(function(){
	var gDOMParser = null;
	
	function clear_dom_parser(){
		gDOMParser = null;
	}
	function parse_xml(text){
		text = replace_entities(text);
		if(document.implementation && document.implementation.createDocument || gUserAgent == UA_IE9 || gUserAgent == UA_IE10){
			if(gDOMParser == null){
				gDOMParser = new DOMParser();
			}
			try{
				return gDOMParser.parseFromString(text, "text/xml");
			}catch(e){
				debug_output("parser error : " + e.message);
				debug_output(text);
				return null;
			}
		}else if(window.ActiveXObject){
			if(gDOMParser == null){
				gDOMParser = new ActiveXObject("Microsoft.XMLDOM");
				gDOMParser.validateOnParse = false;
				gDOMParser.resolveExternals = false;
				gDOMParser.async = false;
			}
			if(gDOMParser.loadXML(text)){
				return gDOMParser;
			}else{
				var parse_error = gDOMParser.parseError;
				debug_output("parser error : " + parse_error.reason + " at line " + parse_error.line + ", pos " + parse_error.linepos + " of " + parse_error.url + " : \"" + parse_error.srcText + "\"");
				return null;
			}
		}else{
			set_browser_not_supported();
			return null;
		}
	}
	
	function replace_entities(text){
		var xml_data = null;
		var replacedText = "";
		
		while(text != ""){
			if(text.match(/(&.+?;)/m)){
				replacedText += RegExp.leftContext;
				var reference = RegExp.$1;
				text = RegExp.rightContext
	
				var replace = ENTITY_LIST[reference];
				if(replace){
					replacedText += replace;
				}else{
					replacedText += reference;
				}
			}else{
				replacedText += text;
				break;
			}
		}
		return replacedText;
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
	

	Lib.get_element_by_id   = get_element_by_id;
	Lib.parse_xml           = parse_xml;
	Lib.clear_dom_parser    = clear_dom_parser;

})();
