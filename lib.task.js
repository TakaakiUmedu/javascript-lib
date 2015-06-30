if(self.Lib == undefined){
	self.Lib = undefined;
}


(function(){
	var CONTINUE = new Object();
	var COMPLETE = new Object();
	
	function asynchronous_task(func, next_item, complete, parallel_count, sequential_count, wait){
		this.func = func;
		if(complete){
			this.complete = complete;
		}else{
			this.complete = Lib.do_nothing;
		}
		if(parallel_count == null){
			this.parallel_count = 1;
		}else{
			this.parallel_count = parallel_count;
		}
		if(sequential_count == null){
			sequential_count = 1;
		}
		if(wait){
			this.wait = wait;
		}else{
			this.wait = 0;
		}
		this.num_process = 0;
		
		var queue_object = this;
		this.proc = function(){
			queue_object.num_process --;
			for(var i = 0; i < sequential_count; i ++){
				var item = next_item();
				if(item == COMPLETE){
					if(queue_object.num_process == 0){
						queue_object.complete();
					}
					return;
				}else if(item == CONTINUE){
					return;
				}else{
					if(queue_object.func(item) == COMPLETE){
						if(queue_object.num_process == 0){
							queue_object.complete();
						}
						return;
					}
				}
			}
			queue_object.start_process(queue_object.wait);
		}
	}
	
	asynchronous_task.prototype = {
		start_process: function(wait){
			this.num_process ++;
			setTimeout(this.proc, wait);
		},
		Wake: function(){
			while(this.num_process < this.parallel_count){
				this.start_process(0);
			}
		}
	}
	
	
	function asynchronous_process_queue(func, complete, parallel_count, sequential_count, wait){
		var queue = this.queue = [];
		function next_item(){
			if(queue){
				var item = queue.shift();
				if(item){
					if(item == COMPLETE){
						queue = null;
					}
					return item;
				}else{
					return CONTINUE;
				}
			}else{
				return COMPLETE;
			}
		}
		this.asynchronous_task = asynchronous_task;
		this.asynchronous_task(func, next_item, complete, parallel_count, sequential_count, wait);
	}
	asynchronous_process_queue.prototype = new asynchronous_task();
	
	asynchronous_process_queue.prototype.Push = function(item){
		this.queue.push(item);
		this.Wake();
	}
	
	function asynchronous_loop(items, func, complete, parallel_count, sequential_count, wait){
		if(typeof(items) == "string"){
			items = parseInt(items);
		}
		var index = 0;
		var index_to_item;
		var next_item;
		if(typeof(items) == "number"){
			next_item = function(){
				if(index < items){
					return index ++;
				}else{
					return COMPLETE;
				}
			}
		}else{
			var length = items.length;
			next_item = function(){
				if(index < length){
					return items[index ++];
				}else{
					return COMPLETE;
				}
			}
		}
		
		var task = new asynchronous_task(func, next_item, complete, parallel_count, sequential_count, wait);
		task.Wake();
	}


	Lib.asynchronous_loop          = asynchronous_loop;
	Lib.asynchronous_process_queue = asynchronous_process_queue;
	Lib.asynchronous_task          = asynchronous_task;
	Lib.COMPLETE = COMPLETE;
	Lib.CONTINUE = CONTINUE;

})();
