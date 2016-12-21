// save-proxy.js
// Manages saving an object to disk when it becomes dirty.
// Tustin2121 - 2015

const fs = require("fs");

module.exports = function(filename, spacing){
	var dirty = false;
	var sendFn = function(){ return 2; };
	var backing = JSON.parse(fs.readFileSync(filename));
	var handlers = {
		// get : function(target, key) {
		// 	return target[key] || undefined;
		// },
		set : function(target, key, val) {
			if (key === 'send') {
				if (typeof val === 'function') {
					sendFn = val.bind(target);
					return true;
				} else {
					sendFn(val)
					return true; //Don't throw TypeErrors that can "crash" the server
				}
			}
			target[key] = val;
			//state[`_${key}`] = val;
			dirty = true;
			return true;
		},
		get : function(target, key) {
			if (key === 'send') {
				return sendFn;
			}
			return target[key];
		},
	};
	var proxy = new Proxy(backing, handlers);
	
	function markDirty() {
		dirty = true;
	}
	function forceSave() {
		try {
			fs.writeFileSync(filename, JSON.stringify(backing, null, spacing));
			dirty = false;
			return true;
		} catch (e) {
			console.error(`Failed to flush ${filename} to disk!`, e);
			return false;
		}
	}
	var _int_ = setInterval(function(){
		if (!dirty) return;
		forceSave();
	}, 5*60*1000);
	
	function dispose() {
	    clearInterval(_int_);
	}
	
	Object.defineProperties(proxy, {
	    "forceSave": {
    	    value: forceSave,
    	    enumerable: false,
    	    writable: false,
    	},
    	"dispose": {
    	    value: dispose,
    	    enumerable: false,
    	    writable: false,
    	},
    	"markDirty": {
    	    value: markDirty,
    	    enumerable: false,
    	    writable: false,
    	},
	});
	return proxy;
};