
if(self["Lib"] == undefined){
	self["Lib"] = new Object();
}

(function(){
	
	function bsearch(min, max, cond){
		if(max < min){
			return -1;
		}

		if(!cond(max)){
			return -1;
		}
		
		var check_min = true;
		
		while(min < max){
			var sum = min + max;
			var mid = (sum - sum % 2) / 2;
			if(cond(mid)){
				max = mid;
			}else{
				min = mid + 1;
			}
		}
		return min;
	}
	
	
	Lib.bsearch = bsearch;
})();

