// Should not be used. Ineffective implementation and not tested weel.


if(self["Lib"] == undefined){
	self["Lib"] = new Object();
}

(function(){
	var DIGITS = 1;
	var BASE;
	
	function double_str(str){
		var res = "";
		var rest = 0;
		var code0 = "0".charCodeAt(0);
		for(var i = str.length - 1; i >= 0; i --){
			var n = str.charCodeAt(i) - code0;
			if(n >= 0 && n <= 9){
				var m = n * 2 + rest;
				var d = m % 10;
				rest = (m - d) / 10;
				res = String.fromCharCode(code0 + d) + res;
			}
		}
		if(rest > 0){
			res = String.fromCharCode(code0 + rest) + res;
		}
		return res;
	}
	
	
	function check(){
		var n = Math.pow(10, DIGITS);
		
		var str = 1;
		for(var i = 0;i < DIGITS; i ++){
			str += "0";
		}
		
		if(("" + n) != str || ("" + (n * n + n)) != str.substr(0, DIGITS) + str){
			alert("biginteger.js: initialize error, DIGITS too long : " + DIGITS);
			return false;
		}
		BASE = n;
		
		return true;
	}
	
	if(!check()){
		return;
	}
	
	var BigInteger = function(src, minus_flag){
		var digits;
		var minus;
		if(src instanceof BigInteger){
			digits = src.digits();
			minus = src.minus;
		}else if(Array.isArray(src)){
			if(src.length == 0){
				digits = [0];
			}else{
				digits = [].concat(src);
				while(digits.length > 1 && digits[digits.length - 1] == 0){
					digits.pop();
				}
			}
			if(minus_flag != undefined){
				minus = minus_flag;
			}else{
				minus = false;
			}
		}else if(typeof(src) == "number"){
			if(src < 0){
				src = -src;
				minus = true;
			}
			src = Math.ceil(src);
			digits = [];
			while(src > 0){
				var r = src % BASE;
				digits.push(r);
				src = (src - r) / BASE;
			}
		}else{
			var num_str = "";
			var regex = /^-/;
			if(regex.exec(src.toString())){
				num_str = src.substr(regex.lastIndex + 1);
				minus = true;
			}else{
				num_str = src;
				minus = false;
			}
			
			digits = [];
			while(true){
				var len = num_str.length;
				if(len == 0){
					break;
				}
				var cut = len > DIGITS ? DIGITS : len;
				digits.push(parseInt(num_str.substr(len - cut, cut)));
				num_str = num_str.substr(0, len - cut);
			}
		}
		if(digits.length == 1 && digits[0] == 0){
			minus = false;
		}
		var length = digits.length;
		this.get_digit = function(i){
			if(i >= 0 && i < length){
				return digits[i];
			}else{
				return 0;
			}
		}
		this.digits = function(){
			return [].concat(digits);
		}
		this.is_minus = function(){
			return minus;
		}
		this.length = length;
	}

	
	function format_digit(digit){
		var str = "" + digit;
		while(str.length < DIGITS){
			str = "0" + str;
		}
		return str;
	}
	
	function add_raw(d1, d2){
		var digits = [];
		var rest = 0;
		for(var i = 0; i < d1.length || i < d2.length; i ++){
			var n = d1.get_digit(i) + d2.get_digit(i) + rest;
			if(n >= BASE){
				digits.push(n - BASE);
				rest = 1;
			}else{
				digits.push(n);
				rest = 0;
			}
		}
		if(rest > 0){
			digits.push(rest);
		}
		return digits;
	}
	
	// d1 > d2
	function sub_raw(d1, d2){
		var digits = [];
		var rest = 0;
		for(var i = 0; i < d1.length || i < d2.length; i ++){
			var n = d1.get_digit(i) - d2.get_digit(i) - rest;
			if(n >= 0){
				digits.push(n);
				rest = 0;
			}else{
				digits.push(n + BASE);
				rest = 1;
			}
		}
		if(rest != 0){
			throw "BigInteger: fatal error";
		}
		return digits;
	}
	
	BigInteger.prototype = {
		toString : function(){
			var ret = "";
			if(this.is_minus()){
				ret += "-";
			}
			var i = this.length - 1;
			ret += this.get_digit(i --);
			while(i >= 0){
//				ret += " "
				ret += format_digit(this.get_digit(i));
				i --;
			}
			return ret;
		},

		rev_sign: function(){
			if(this.is_zero()){
				return this;
			}else{
				return new BigInteger(this.digits(), !this.is_minus());
			}
		},
		add: function(num){
			if(this.is_minus() && num.is_minus()){
				return new BigInteger(add_raw(this, num), true);
			}else if(this.is_minus()){
				return num.sub(this.rev_sign());
			}else if(num.is_minus()){
				return this.sub(num.rev_sign());
			}
			return new BigInteger(add_raw(this, num));
		},
		comp: function(num){
			if(this.is_minus() && num.is_minus()){
				return num.rev_sign().comp(this.rev_sign());
			}else if(this.is_minus()){
				return -1;
			}else if(num.is_minus()){
				return 1;
			}
			
			if(this.length > num.length){
				return 1;
			}
			if(this.length < num.length){
				return -1;
			}
			for(var i = this.length - 1; i >= 0; i --){
				var d1 = this.get_digit(i);
				var d2 = num.get_digit(i);
				if(d1 > d2){
					return 1;
				}else if(d1 < d2){
					return -1;
				}
			}
			return 0;
		},
		sub: function(num){
			if(this.is_minus() && num.is_minus()){
				return num.rev_sign().sub(this.rev_sign());
			}else if(this.is_minus()){
				return new BigInteger(add_raw(this, num), true);
			}else if(num.is_minus()){
				return new BigInteger(add_raw(this, num));
			}
			
			if(this.comp(num) < 0){
				return num.sub(this).rev_sign();
			}
			return new BigInteger(sub_raw(this, num));
		},
		mul_one: function(num){
			var i = 0;
			var rest = 0;
			var digits = [];
			while(i < this.length){
				var n = this.get_digit(i) * num + rest;
				var m = n % BASE;
				digits.push(m);
				rest = (n - m) / BASE;
				i ++;
			}
			if(rest > 0){
				digits.push(rest);
			}
			return new BigInteger(digits, this.is_minus());
		},
		mul: function(num){
			var ret = new BigInteger(0);
			
			for(var i = 0; i < num.length; i ++){
				var tmp_digits = this.mul_one(num.get_digit(i)).digits();
				for(j = 0; j < i; j ++){
					tmp_digits.unshift(0);
				}
				ret = ret.add(new BigInteger(tmp_digits));
			}
			if(this.is_minus() ^ num.is_minus()){
				ret = ret.rev_sign();
			}
			
			return ret;
		},
		is_zero: function(){
			return this.length == 1 && this.get_digit(0) == 0;
		},
		div: function(num){
			if(num.is_zero()){
				throw "BigInteger: error, divide by 0";
			}
			var rest = new BigInteger(this);
			var res = [];
			var tmp = new BigInteger(num);
			
			var i = 0;
			
			while(true){
				var tmp2 = new BigInteger([0].concat(tmp.digits()));
				if(rest.comp(tmp2) < 0){
					break;
				}
				tmp = tmp2;
				i ++;
			}
			
			while(true){
				var n = tmp.length - 1;
				var d1 = rest.get_digit(n + 1) * BASE + rest.get_digit(rest, n);
				var d2 = tmp.get_digit(n) + 1;
				var guess = Math.floor(d1 / d2);
				
				guess = Lib.bsearch(guess, BASE, function(n){
					loop_count ++;
					return rest.comp(tmp.mul_one(n)) < 0;
				});
				guess--;
				
				res.unshift(guess);
				rest = rest.sub(tmp.mul_one(guess));
				if(num.length == tmp.length){
					break;
				}
				tmp = new BigInteger(tmp.digits().slice(1));
			}
			
			return [new BigInteger(res), rest];
		},
		equals: function(num){
			if(typeof(num) == "number"){
				return this.length == 1 && this.get_digit(0) == num;
			}else if(typeof(num) == "string"){
				return this.toString() == num;
			}else if(num instanceof BigInteger){
				return this.comp(num) == 0;
			}else{
				return false;
			}
		},
		pow: function(power, law){
			var res = BigInteger.One;
			var n = this;
			while(!power.is_zero()){
				var div = power.div(BigInteger.Two);
				if(div[1].equals(1)){
					res = res.mul(n).div(law)[1];
				}
				n = n.mul(n).div(law)[1];
				if(div[0].get_digit(0) < 0){
					throw "error";
				}
				power = div[0];
			}
			return res;
		},
		is_prime: function(){ // implemented reffering to https://ja.wikipedia.org/wiki/%E3%83%9F%E3%83%A9%E3%83%BC-%E3%83%A9%E3%83%93%E3%83%B3%E7%B4%A0%E6%95%B0%E5%88%A4%E5%AE%9A%E6%B3%95
			n = this;
			if(n.is_minus()){
				n = n.rev_sign();
			}
			if(n.is_zero()){
				return false;
			}
			if(n.equals(BigInteger.One)){
				return false;
			}
			if(n.equals(BigInteger.Two)){
				return true;
			}
			if(n.div(BigInteger.Two)[1].is_zero()){
				return false;
			}
			var d = n.sub(BigInteger.One);
			while(true){
				var r = d.div(BigInteger.Two);
				if(!r[1].is_zero()){
					break;
				}
				d = r[0];
			}
			var n_m1 = n.sub(BigInteger.One);
			var n_m2 = n.sub(BigInteger.Two);
			for(var i = 0; i < PRIME_TEST_COUNT; i ++){
				var a = n_m2.random().add(BigInteger.One);
				var t = new BigInteger(d);
				var y = a.pow(t, n);
				while(!t.equals(n_m1) && !y.equals(BigInteger.One) && !y.equals(n_m1)){
					y = y.mul(y).div(n)[1];
					t = t.mul(BigInteger.Two);
				}
				if(!y.equals(n_m1) && t.div(BigInteger.Two)[1].is_zero()){
					return false;
				}
			}
			return true;
		},
		random: function(){
			var rand = [];
			for(var i = 0; i < this.length; i++){
				rand.push(Math.floor(Math.random() * BASE));
			}
			result = this.mul(new BigInteger(rand));
			return new BigInteger(result.digits().slice(this.length));
		},
	}
	var PRIME_TEST_COUNT = 20;
	var loop_count = 0;
	
	BigInteger.get_loop_count = function(){
		return loop_count;
	}
	BigInteger.Zero = new BigInteger(0);
	BigInteger.One = new BigInteger(1);
	BigInteger.Two = new BigInteger(2);
	
	Lib.BigInteger = BigInteger;
	
})();


