// modified from: https://github.com/csquared/node-logfmt/blob/master/lib/stringify.js

export function logfmt(data: any, prefix: string = ""): string {
    var line = '';
  
    for (var key in data) {
		var value = data[key];

		// if array, then combine into a string
		if (Array.isArray(value)) {
			value = value.join(",")
		}

		if (typeof value === 'object') {
			// if an object, then call recursively
			line += logfmt(value, `${prefix == "" ? "" : prefix + "."}` + key) + ' '
		} else {
			var is_null = false;
			if(value == null) {
				is_null = true;
				value = '';
			}
			else value = value.toString();
		
			var needs_quoting  = value.indexOf(' ') > -1 || value.indexOf('=') > -1;
			var needs_escaping = value.indexOf('"') > -1 || value.indexOf("\\") > -1;
		
			if(needs_escaping) value = value.replace(/["\\]/g, '\\$&');
			if(needs_quoting || needs_escaping) value = '"' + value + '"';
			if(value === '' && !is_null) value = '""';
		
			line += `${prefix == "" ? "" : prefix + "."}` + key + '=' + value + ' ';
		}
    }
  
    // trim traling space
    return line.substring(0,line.length-1);
}
  