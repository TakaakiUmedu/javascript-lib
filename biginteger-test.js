
(function(){
	var BigInteger = Lib.BigInteger;
	
	function test(){
		
		var output_pre = null;
		output_pre = document.createElement("pre");
		output_pre.appendChild(document.createTextNode(""));
		document.body.appendChild(output_pre);
		
		function puts(message){
			output_pre.firstChild.nodeValue += message + "\n";
		}

		function print(message){
			output_pre.firstChild.nodeValue += message;
		}
		
		/*
		for(var i = 0; i < 10000; i ++){	
			var result = Lib.bsearch(0, 9999, function(n){
				return n >= i;
			});
			if(result != i){
				puts(i  + ": " + result);
			}
		}
		*/
		
		
//		puts(new BigInteger([10, 20], true));
		
		
		puts(new BigInteger.Dec1("12345678901234567890"));
		puts(new BigInteger.DecMax("12345678901234567890"));

		puts(new BigInteger.Dec1("12345678901234567890").add(new BigInteger.Dec1("12345678901234567890")));
		puts(new BigInteger.DecMax("12345678901234567890").add(new BigInteger.DecMax("12345678901234567890")));


		puts(new BigInteger.BinMax("12345678901234567890"));
		
		
		puts(new BigInteger("-10234567890"));
		
		var n = new BigInteger("-10234567890");
		var m = new BigInteger("-10234567890");
		
		puts(n.add(m));
		
		puts(new BigInteger("8"));
		puts(new BigInteger("-27621977").mul_one(0));
		
		puts(":" + (-27621977 * 0));
		
		
		puts("" + (Math.pow(17,10)));
		puts("" + (Math.pow(17,10) % 157));
		puts("" + new (BigInteger.Bin(1))(17).pow(10,157));
		puts("" + new (BigInteger.Dec(1))(17).pow(10,157));
		
//		return;
	


//		var n1 = new BigInteger("53282444");
//		var n2 = new BigInteger("81");
//		
//		alert(n1.div(n2));
		
		var MAX_INT = 100000000;
		
//		if(false){
		
		
		function test(BigInteger, output, random_list){
			output("【COMP】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var m = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var bn = new BigInteger(n);
				var bm = new BigInteger(m);
				
				var comp = n == m ? 0 : (n > m ? 1 : -1);
				output(bn.toString() + " <=> " + bm.toString() + " : " + comp + " <=> " + bn.comp(bm) + " , " + (-bm.comp(bn)));
				if(comp != bn.comp(bm) || comp != -bm.comp(bn)){
					alert(bn.toString() + " <=> " + bm.toString() + " : " + comp + " <=> " + bn.comp(bm) + " , " + (-bm.comp(bn)));
					break;
				}
			}
	
			output("【ADD】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var m = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var bn = new BigInteger(n);
				var bm = new BigInteger(m);
				
				var res1 = "" + (n + m);
				var res2 = bn.add(bm).toString();
				
				output("" + n + " + " + m + " : " + res1 + " = " + res2);
				if(res1 != res2){
					alert(res1 + " <=> " + res2);
					break;
				}
			}
			
			output("【SUB】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var m = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var bn = new BigInteger(n);
				var bm = new BigInteger(m);
				
				var res1 = "" + (n - m);
				var res2 = bn.sub(bm).toString();
				
				output("" + n + " - " + m + " : " + res1 + " = " + res2);
				if(res1 != res2){
					alert(res1 + " <=> " + res2);
					break;
				}
			}
	
			output("【MUL_ONE】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var m = Math.floor(Math.random() * 100);
				var bn = new BigInteger(n);
				
				var res1 = "" + (n * m);
				var res2 = bn.mul_one(m).toString();
				
				output("" + n + "," + m + ": " + res1 + " = " + res2);
				if(res1 != res2){
					alert("" + n + "," + m + ": " + res1 + " <=> " + res2);

				var res2 = bn.mul_one(m).toString();

					break;
				}
			}
			
			
			output("【MUL】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var m = Math.floor(Math.random() * MAX_INT - MAX_INT / 2);
				var bn = new BigInteger(n);
				var bm = new BigInteger(m);
				
				var res1 = "" + (n * m);
				var res2 = bn.mul(bm).toString()
				
				output(res1 + " = " + res2);
				if(res1 != res2){
					alert(res1 + " <=> " + res2);
					break;
				}
			}
			
			
	//		return;
	//		}

			output("【DIV_ONE】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT);
				var m = Math.floor(Math.random() * Math.sqrt(MAX_INT)) + 1;
				var bn = new BigInteger(n);
				
				var res1 = "" + ((n - n % m) / m);
				var res2 = "" + (n % m);
				var div = bn.div_one(m);
				var res3 = div[0].toString();
				var res4 = div[1].toString();
				
				output("" + n + " / " + m + " : "+ res1 + " <=> " + res3 + " , " + res2 + " <=> " + res4);
				if(res1 != res3 || res2 != res4){
					alert("" + n + " / " + m + " : "+ res1 + " <=> " + res3 + " , " + res2 + " <=> " + res4);
					break;
				}
			}
						
			output("【DIV】");
			for(var i = 0; i < 100; i ++){
				var n = Math.floor(Math.random() * MAX_INT);
				var m = Math.floor(Math.random() * Math.sqrt(MAX_INT)) + 1;
				var bn = new BigInteger(n);
				var bm = new BigInteger(m);
				
				var res1 = "" + ((n - n % m) / m);
				var res2 = "" + (n % m);
				var div = bn.div(bm);
				var res3 = div[0].toString();
				var res4 = div[1].toString();
				
				output("" + n + " / " + m + " : "+ res1 + " <=> " + res3 + " , " + res2 + " <=> " + res4);
				if(res1 != res3 || res2 != res4){
					alert("" + n + " / " + m + " : "+ res1 + " <=> " + res3 + " , " + res2 + " <=> " + res4);
					break;
				}
			}
			
			if(false){
			for(var i = 10000; i < 10001; i ++){
				print(i + ": ");
				var n = new BigInteger(i);
				var list = [];
				for(var j = 0; j < i; j ++){
					list.push(j);
				}
				while(list.length > 0){
					var r = parseInt(n.random().toString());
					if(r >= n){
						alert(r + " > " + n);
						break;
					}
					var index = list.indexOf(r);
					if(index >= 0){
						list.splice(index, 1);
						print(r + ", ");
					}
				}
				output("");
			}
			}
			
			var a = new BigInteger("18");
			var t = new BigInteger("33");
			var n = new BigInteger("67");
			
			print = function(){};
			
			output(a.pow(t, n));
			
			output(is_prime(9));
			
			for(var i = 1; i < 200;i ++){
				let mes = "";
				mes += (i + ": ");
				var prime = new BigInteger(i).is_prime();
				if(prime){
					mes += "prime";
				}else{
					mes += "not prime";
				}
				if(prime != (is_prime(i) == true)){
					output(mes + ": ERROR!")
				}else{
					output(mes + ": SUCCESS")
				}
			}
			
			for(var i = 0; i < random_list.length; i ++){
				var n = random_list[i];
				var bn = new BigInteger(n);
				var p_n = is_prime(n);
				var p_bn = bn.is_prime();
				
				print(n + ": ");
				
				if((p_n == true) != p_bn){
					output(n + ": ERROR! : " + p_n + " <=> "+ p_bn + ", " + p_n);
				}else{
					output(n + ": SUCCESS! : " + p_n + " <=> "+ p_bn);
				}
			}
			
			
		}
		
		var test_list = {
			BinMax: BigInteger.BinMax,
			DecMax: BigInteger.DecMax,
			"Dec(1)": BigInteger.Dec1,
			"Bin(1)": BigInteger.Bin(1),
		}

		var random_list = [];
		for(var i = 0; i < 0; i ++){
			random_list.push(Math.floor(Math.random() * MAX_INT * MAX_INT));
		}
		
		for(let name in test_list){
			BigInteger.reset_loop_count();
			puts("【" + name + "】");
			var time = new Date();
//			test(test_list[name], function(mes){mes.toString()}, random_list);
			test(test_list[name], puts, random_list);
			puts(new Date() - time);
			puts("loop_count: " + BigInteger.get_loop_count());
		}
	}
	
	
	function is_prime(n){
		var n_sqr = Math.ceil(Math.sqrt(n));
		if(n == 1){
			return 1;
		}
		if(n == 2){
			return true;
		}
		if(n % 2 == 0){
			return 2;
		}
		for(var i = 3; i <= n_sqr; i += 2){
			if(n % i == 0){
				return i;
			}
		}
		return true;
	}
	
	Lib.execute_on_load(test);
	
})();



