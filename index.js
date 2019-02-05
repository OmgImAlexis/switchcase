(function() {
	function matches(value,pattern) {
		return Object.keys(pattern).every(key => {
			const pvalue = pattern[key],
				ptype = typeof(value),
				vvalue = value[key],
				vtype = typeof(vvalue);
			if(ptype==="undefined" || (pvalue && ptype==="object" && Object.keys(pvalue).length===0)) return true;
			if(pvalue && ptype==="object" && vtype==="object") {
				return vvalue ? matches(vvalue,pvalue) : false;
			}
			return pvalue===vvalue;
		})
	}
	function switchcase(cases={},defaults={}) {
		const switches = [];
		if(defaults && typeof(defaults)!=="object") {
			defaults = {strict:defaults};
		}
		Object.keys(cases).forEach((key) => {
			let test = key;
			try {
				test = Function("return " + key)();
			} catch(e) { true; }
			switches.push([test,cases[key]]);
		});
		const switcher = (value,options) => {
			options = Object.assign({},defaults,options);
			if(options.continuable) options.call = true;
			for(let item of switches) {
				const key = item[0],
					type = typeof(key);
				if((key && type==="object" && key instanceof RegExp && key.test(value)) 
						|| (type==="function" && key(value)) 
						|| (options.strict && key===value) 
						|| (!options.strict && key==value) 
						|| key && type==="object" && matches(value,key)) {
					let result = item[1];
					if(typeof(result)==="function" && options.call) {
						const resolved = result(value);
						if(resolved!==undefined || !options.continuable) return resolved;
						if(options.continuable) continue;
						result = resolved;
					}
					return result;
				}
			} 
			return switcher.otherwise; 
		};
		switcher.otherwise = cases.default;
		switcher.case = (test,value) => {
			switches.push([test,value]);
			return switcher;
		};
		switcher.default = (value) => {
			switcher.otherwise = value;
			return switcher;
		};
		switcher.match = (value) => switcher(value);
		return switcher;
	}
	
	if(typeof(module)!=="undefined") {
		module.exports = switchcase;
	} 
	if(typeof(window)!=="undefined") {
		window.switchcase = switchcase;
	}
}());