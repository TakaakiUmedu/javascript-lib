// Should not be used. Ineffective implementation and not tested weel.


if(self["Lib"] == undefined){
	self["Lib"] = new Object();
}

(function(){
	
	function calc_base(b, digits){
		if((b == 10 || b == 2) && digits == 1){
			return b;
		}
		var base = Math.pow(b, digits);
		var n = base - 1;
		var m = new BigIntegerDec1(b).pow(new BigIntegerDec1(digits)).sub(BigIntegerDec1.One);
		if((n * n + n).toString() != (m.mul(m).add(m)).toString()){
			return null;
		}
		return base;
	}
	
	function initialize_big_integer(dst, big_integer_class, src, minus_flag, converter){
		var converted = parse_value(big_integer_class, src, minus_flag);
		if(converted == null){
			converted = converter(big_integer_class, src);
		}
		
		if(converted.values.length == 1 && converted.values[0] == 0){
			minus = false;
		}
		dst.values = converted.values;
		dst.minus = converted.minus;
		dst.length = dst.values.length;
		Object.freeze(dst.values);
		Object.freeze(dst);
	}
	
	function convert_via_dec(big_integer_class, src){
		return parse_value(big_integer_class, new BigInteger.DecMax(src));
	}
	
	function convert_via_str(big_integer_class, src){
		return parse_value_dec(src, big_integer_class.digits);
	}

	function define_big_integer_class(base, converter){
		function big_integer_class(src, minus_flag){
			initialize_big_integer(this, big_integer_class, src, minus_flag, converter);
		}
		copy_properties(BigIntegerClassMethods, big_integer_class);
		copy_properties(BigIntegerInstanceMethods, big_integer_class.prototype);
		big_integer_class.big_integer_base = BigIntegerBase;
		big_integer_class.base = base;
		big_integer_class.Zero = new big_integer_class(0);
		big_integer_class.One = new big_integer_class(1);
		big_integer_class.Two = new big_integer_class(2);
		
		return big_integer_class;
	}
	
	function define_big_integer_class_bin(digits){
		var base = calc_base(2, digits);
		if(base == null){
			throw "biginteger.js: initialize error, digits too long : " + digits;
		}
		var big_integer_class = define_big_integer_class(base, convert_via_dec);
		
		return big_integer_class;
	}
	
	var BigIntegerBase = {};
	
	function define_big_integer_class_dec(digits){
		var base = calc_base(10, digits);
		if(base == null){
			throw "biginteger.js: initialize error, digits too long : " + digits;
		}
		
		var big_integer_class = define_big_integer_class(base, convert_via_str);
		
		copy_properties(BigIntegerDecInstanceMethods, big_integer_class.prototype);
		big_integer_class.digits = digits;
		
		return big_integer_class;
	}
	
	function parse_value(dst_class, src, minus_flag){
		if(src.constructor == dst_class){
			return src;
		}else if(Array.isArray(src)){
			let values;
			let minus;
			if(src.length == 0){
				values = [0];
			}else{
				values = [].concat(src);
				while(values.length > 1 && values[values.length - 1] == 0){
					values.pop();
				}
				for(let i = 0; i < values.length; i ++){
					if(values[i] > dst_class.base){
						throw "Invalid digit[" + i + "] = " + values[i] + " > BASE = " + dst_class.base;
					}
				}
			}
			if(minus_flag != undefined){
				minus = minus_flag;
			}else{
				minus = false;
			}
			return {values: values, minus: minus}
		}else if(typeof(src) == "number"){
			if(src == 0){
				return {values: [0], minus: false};
			}
			let minus;
			if(src < 0){
				src = -src;
				minus = true;
			}else{
				minus = false;
			}
			src = Math.ceil(src);
			let values = [];
			while(src > 0){
				var r = src % dst_class.base;
				values.push(r);
				src = (src - r) / dst_class.base;
			}
			return {values: values, minus: minus};
		}else if(src.constructor.big_integer_base == BigIntegerBase){
			if(src.is_zero()){
				return {values: [0], minus: false};
			}
			var values = [];
			var minus;
			if(src.minus){
				src = src.rev_sign();
				minus = true;
			}else{
				minus = false;
			}
			var bi_base = new src.constructor(dst_class.base);
			while(!src.is_zero()){
				var div = src.div(bi_base);
				values.push(div[1].toInt());
				src = div[0];
			}
			return {values:values, minus: minus};
		}
		return null;
	}
	
	function parse_value_dec(src, digits){
		var num_str = "";
		var regex = /^-/;
		if(regex.exec(src.toString())){
			num_str = src.substr(regex.lastIndex + 1);
			minus = true;
		}else{
			num_str = src;
			minus = false;
		}
		
		values = [];
		while(true){
			var len = num_str.length;
			if(len == 0){
				break;
			}
			var cut = len > digits ? digits : len;
			values.push(parseInt(num_str.substr(len - cut, cut)));
			num_str = num_str.substr(0, len - cut);
		}
		return {values: values, minus: minus};
	}
	
	function copy_properties(src, dst){
		if(dst == undefined){
			dst = {};
		}
		for(let name in src){
			dst[name] = src[name];
		}
		return dst;
	}
	
	function format_digit(digit, len){
		var str = "" + digit;
		while(str.length < len){
			str = "0" + str;
		}
		return str;
	}
	
	function add_raw(d1, d2, base){
		var values = [];
		var rest = 0;
		var l1 = d1.length;
		var l2 = d2.length;
		var ls = l1 < l2 ? l1 : l2;
		let i = 0;
		while(i < ls){
			var n = d1[i] + d2[i] + rest;
			if(n >= base){
				values.push(n - base);
				rest = 1;
			}else{
				values.push(n);
				rest = 0;
			}
			i ++;
		}
		while(i < l1){
			var n = d1[i] + rest;
			if(n >= base){
				values.push(n - base);
				rest = 1;
			}else{
				values.push(n);
				rest = 0;
			}
			i ++;
		}
		while(i < l2){
			var n = d2[i] + rest;
			if(n >= base){
				values.push(n - base);
				rest = 1;
			}else{
				values.push(n);
				rest = 0;
			}
			i ++;
		}
		
		if(rest > 0){
			values.push(rest);
		}
		return values;
	}
	
	// require: d1 > d2
	function sub_raw(d1, d2, base){
		var values = [];
		var rest = 0;
		var l1 = d1.length;
		var l2 = d2.length;
		let i = 0;
		if(l2 > l1){
			throw "BigInteger: fatal error";
		}
		
		while(i < l2){
			var n = d1[i] - d2[i] - rest;
			if(n >= 0){
				values.push(n);
				rest = 0;
			}else{
				values.push(n + base);
				rest = 1;
			}
			i ++;
		}
		while(i < l1){
			var n = d1[i] - rest;
			if(n >= 0){
				values.push(n);
				rest = 0;
			}else{
				values.push(n + base);
				rest = 1;
			}
			i ++;
		}
		if(rest != 0){
			throw "BigInteger: fatal error";
		}
		return values;
	}
	
	var BigIntegerClassMethods = {
		convert : function(src){
			if(src.constructor == this){
				return src;
			}else{
				new this(src);
			}
		}
	}
	
	var BigIntegerInstanceMethods = {
		toInt: function(){
			var ret = 0;
			var base = this.constructor.base;
			for(let i = this.length - 1; i >= 0; i --){
				ret = ret * base + this.values[i];
			}
			return ret;
		},
		
		get_digit: function(i){
			if(i >= 0 && i < this.length){
				return this.values[i];
			}else{
				return 0;
			}
		},
	
		rev_sign: function(){
			if(this.is_zero()){
				return this;
			}else{
				return new this.constructor(this.values, !this.minus);
			}
		},
		
		add: function(num){
			num = this.constructor.convert(num);
			if(this.minus && num.minus){
				return new this.constructor(add_raw(this.values, num.values, this.constructor.base), true);
			}else if(this.minus){
				return num.sub(this.rev_sign());
			}else if(num.minus){
				return this.sub(num.rev_sign());
			}
			return new this.constructor(add_raw(this.values, num.values, this.constructor.base));
		},
		
		comp: function(num){
			num = this.constructor.convert(num);
			if(this.minus && num.minus){
				return num.rev_sign().comp(this.rev_sign());
			}else if(this.minus){
				return -1;
			}else if(num.minus){
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
			num = this.constructor.convert(num);
			if(this.minus && num.minus){
				return num.rev_sign().sub(this.rev_sign());
			}else if(this.minus){
				return new this.constructor(add_raw(this.values, num.values, this.constructor.base), true);
			}else if(num.minus){
				return new this.constructor(add_raw(this.values, num.values, this.constructor.base));
			}
			
			if(this.comp(num) < 0){
				return num.sub(this).rev_sign();
			}
			return new this.constructor(sub_raw(this.values, num.values, this.constructor.base));
		},
		
		mul_one: function(num){
			var i = 0;
			var rest = 0;
			var values = [];
			var base = this.constructor.base;
			while(i < this.length){
				let n = this.get_digit(i) * num + rest;
				let m = n % base;
				values.push(m);
				rest = (n - m) / base;
				i ++;
			}
			while(rest > 0){
				let m = rest % base;
				values.push(m);
				rest = (rest - m) / base;
			}
			return new this.constructor(values, this.minus);
		},
		
		mul: function(num){
			num = this.constructor.convert(num);
			var ret = new this.constructor(0);
			
			for(var i = 0; i < num.length; i ++){
				var tmp_values = [].concat(this.mul_one(num.get_digit(i)).values);
				for(j = 0; j < i; j ++){
					tmp_values.unshift(0);
				}
				ret = ret.add(new this.constructor(tmp_values));
			}
			if(this.minus ^ num.minus){
				ret = ret.rev_sign();
			}
			
			return ret;
		},
		
		is_zero: function(){
			return this.length == 1 && this.get_digit(0) == 0;
		},
		
		div: function(num){
			num = this.constructor.convert(num);
			if(num.is_zero()){
				throw "this.constructor: error, divide by 0";
			}
			var rest = new this.constructor(this);
			var res = [];
			var tmp = new this.constructor(num);
			
			var i = 0;
			
			while(true){
				var tmp2 = new this.constructor([0].concat(tmp.values));
				if(rest.comp(tmp2) < 0){
					break;
				}
				tmp = tmp2;
				i ++;
			}
			let base = this.constructor.base;
			
			while(true){
				var n = tmp.length - 1;
				var d1 = rest.get_digit(n + 1) * base + rest.get_digit(n);
				var d2 = tmp.get_digit(n) + 1;
				var guess = Math.floor(d1 / d2);
				
				guess = Lib.bsearch(guess, base, function(n){
					loop_count ++;
					return rest.comp(tmp.mul_one(n)) < 0;
				});
				guess--;
				
				res.unshift(guess);
				rest = rest.sub(tmp.mul_one(guess));
				if(num.length == tmp.length){
					break;
				}
				tmp = new this.constructor(tmp.values.slice(1));
			}
			
			return [new this.constructor(res), rest];
		},

		div_one: function(num){
			if(num == 0){
				throw "this.constructor: error, divide by 0";
			}
			var rest = 0;
			var res = [];
			var base = this.constructor.base;
			for(let i = this.length - 1; i >= 0; i --){
				var n = this.values[i] + rest * base;
				var m = n % num;
				res.unshift((n - m) / num);
				rest = m;
			}
			
			return [new this.constructor(res), rest];
		},
		
		equals: function(num){
			if(typeof(num) == "number"){
				return this.length == 1 && this.values[0] == num;
			}else if(typeof(num) == "string"){
				return this.toString() == num;
			}else if(num.constructor == this.constructor){
				return this.comp(num) == 0;
			}else{
				return this.comp(this.constructor.convert(num)) == 0;
			}
		},
		
		pow: function(power, law){
			if(!(power.constructor.big_integer_base === BigIntegerBase)){
				power = new BigInteger.BinMax(power);
			}
			var res = this.constructor.One;
			var n = this;
			if(law != undefined){
				law = this.constructor.convert(law);
				while(!power.is_zero()){
					var div = power.div_one(2);
					if(div[1] == 1){
						res = res.mul(n).div(law)[1];
					}
					n = n.mul(n).div(law)[1];
					if(div[0].values[0] < 0){
						throw "error";
					}
					power = div[0];
				}
			}else{
				while(!power.is_zero()){
					var div = power.div_one(2);
					if(div[1] == 1){
						res = res.mul(n);
					}
					n = n.mul(n);
					if(div[0].values[0] < 0){
						throw "error";
					}
					power = div[0];
				}
			}
			return res;
		},
		
		is_prime: function(){ // implemented reffering to https://ja.wikipedia.org/wiki/%E3%83%9F%E3%83%A9%E3%83%BC-%E3%83%A9%E3%83%93%E3%83%B3%E7%B4%A0%E6%95%B0%E5%88%A4%E5%AE%9A%E6%B3%95
			n = this;
			if(n.minus){
				n = n.rev_sign();
			}
			if(n.is_zero()){
				return false;
			}
			if(n.equals(this.constructor.One)){
				return false;
			}
			if(n.equals(this.constructor.Two)){
				return true;
			}
			if(n.div(this.constructor.Two)[1].is_zero()){
				return false;
			}
			var d = n.sub(this.constructor.One);
			while(true){
				var r = d.div_one(2);
				if(r[1] != 0){
					break;
				}
				d = r[0];
			}
			var n_m1 = n.sub(this.constructor.One);
			var n_m2 = n.sub(this.constructor.Two);
			for(var i = 0; i < PRIME_TEST_COUNT; i ++){
				var a = n_m2.random().add(this.constructor.One);
				var t = new this.constructor(d);
				var y = a.pow(t, n);
				while(!t.equals(n_m1) && !y.equals(this.constructor.One) && !y.equals(n_m1)){
					y = y.mul(y).div(n)[1];
					t = t.mul_one(2);
				}
				if(!y.equals(n_m1) && t.div_one(2) == 0){
					return false;
				}
			}
			return true;
		},
		
		random: function(){
			var rand = [];
			let base = this.constructor.base;
			for(var i = 0; i < this.length; i++){
				rand.push(Math.floor(Math.random() * base));
			}
			result = this.mul(new this.constructor(rand));
			return new this.constructor(result.values.slice(this.length));
		},

		toString: function(){
			return new BigInteger.DecMax(this).toString();
		},
		
	}

	var BigIntegerDecInstanceMethods = {
		toString: function(){
			var ret = "";
			if(this.minus){
				ret += "-";
			}
			var i = this.length - 1;
			ret += this.values[i --];
			let len = this.constructor.digits;
			while(i >= 0){
				ret += format_digit(this.values[i], len);
				i --;
			}
			return ret;
		},
	}

	
	var PRIME_TEST_COUNT = 20;
	var loop_count = 0;
	
	function define_max_class(base){
		var i = 1;
		var digits = 0;
		while(true){
			if(calc_base(base, i + 1) == null){
				digits = i;
				break;
			}
			i ++;
		}
		if(base == 2){
			return define_big_integer_class_bin(digits);
		}else if(base == 10){
			return define_big_integer_class_dec(digits);
		}
		return null;
	}
	
	var BigIntegerDec1 = define_big_integer_class_dec(1);
	var BigInteger = define_max_class(2);
	
	BigInteger.Dec1 = BigIntegerDec1;
	BigInteger.BinMax = BigInteger;
	BigInteger.DecMax = define_max_class(10);
	
	BigInteger.Bin = define_big_integer_class_bin;
	BigInteger.Dec = define_big_integer_class_dec;
	
	BigInteger.get_loop_count = function(){
		return loop_count;
	}
	
	Lib.BigInteger = BigInteger;
	
})();


