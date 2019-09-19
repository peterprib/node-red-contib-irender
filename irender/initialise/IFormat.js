/*
 * [{column:0,format:afunction,title:"a col"},...]
 */
function IFormat(options) {
	Object.assign(this,{format:"auto"},options);
	this.formatter=this[this.format];
	return this;
}
IFormat.prototype.toHTML = function () {
		return document.createTextNode(this.formatter.apply(this,arguments));
};
IFormat.prototype.auto = function (v) {
	this.formatter=IFormat.prototype.copy;
	return this.formatter.apply(this,arguments);
};
IFormat.prototype.copy = function (v) {
		return v;
};
IFormat.prototype.clone = IFormat.prototype.copy;
IFormat.prototype.noChange = IFormat.prototype.copy;
IFormat.prototype.getStringAfterDelimiter = function (v) {
	return getStringAfterDelimiter(v,wordPosition,delimiter);
};
IFormat.prototype.regexp = function (v) {
	return v.split(this.regPattern,1)[0];
};
IFormat.prototype.substr = function (v) {
	if(isNaN(stringLength))
    	return v.substr(startPosition);
	else
    	return v.substr(startPosition,stringLength);
};
IFormat.prototype.substring = function (v) {
	if(isNaN(stringLength))
    	return v.substring(startPosition);
	else
    	return v.substring(startPosition,stringLength);
};
IFormat.prototype.word = function (v) {
	try{
		return v.split(wordPattern,wordPositionLimit)[wordPosition];
	} catch(e) {}
	return ""; 
};
IFormat.prototype.toDuration = function (v) {
	v=parseFloat(v);
	var r="",t;
	if(v>=60) {
		if(v>=3600) {
			if(v>=86440) {
				if(Options.toDuration=='D') return Math.round(v/86400).toString()+'D'; 
				t = Math.floor(v/86400);
				v=v-t*86400;
				r+=t.toString()+'D';
			}
			if(Options.toDuration=='H') return r+Math.round(v/360).toString()+'H'; 
			t = Math.floor(v/3600);
			v-=t*3600;
			r+=(t>9?'':'0')+t.toString()+'H';
		}
		if(Options.toDuration=='M') return r+Math.round(v/60).toString()+'M'; 
		t = Math.floor(v/60);
		v-=t*60;
		r+=(t>9?'':'0')+t.toString()+'M';
	}
	if(Options.toDuration=='S') return r+Math.round(v/60).toString()+'S'; 
	return r+(v>9?'':'0')+v.toFixed(6).toString();
};
IFormat.prototype.parseFloat = parseFloat;
IFormat.prototype.parseInt = parseInt;
IFormat.prototype.toExponential = function (v) {
	return Number(v).toExponential(Options.toExponentialVal);
};
IFormat.prototype.toFixed = function (v) {
	return Number(v).toFixed(Options.toFixedVal);
};
IFormat.prototype.toPrecision = function (v) {
	return Number(v).toPrecision(Options.toPrecisionVal);
};
IFormat.prototype.toBase = function (v) {
	return Number(v).toString(Options.toBaseVal);
};
IFormat.prototype.number = function (v) {
	v = Number(v);
	if(Options.separator) {
		var valueString=v.toString().split('.');
		v="";
		if(valueString[1]!=null) {
			v='.'+valueString[1].substr(0,3);
			for (var i=3;i<valueString[1].length;i+=3) {
				v+=Options.separator+valueString[1].substr(i,3);
			}
		} 
		len=valueString[0].length-1;
		value=valueString[0].substr(valueString[0].length-1,1)+v;
		for (var i=valueString[0].length-2;i>=0;i--) {
			value=valueString[0].substr(i,1)+((len-i)%3==0?Options.separator:'')+v;
		}
	}
};
IFormat.prototype.toAbbreviatedNumber = function (v) {
	return formatNumberToAbbreviated(v);
};
IFormat.prototype.appendAbbreviatedNumber = function (v) {
	return v + " ("+this.toAbbreviatedNumber(v)+")";
};
IFormat.prototype.prependAbbreviatednumber = function (v) {
	return this.toAbbreviatedNumber(v) + " ("+v+")";
};
IFormat.prototype.wrap = function (v) {
	return Options.pre + v + Options.post;
};
IFormat.prototype.toYesNo = function (v) {
	return v=="y"||v=="1"||v==1?'Yes':"No";
};
IFormat.prototype.toBoolean = function (v) {
	return v=="t"||v=="1"||v==1?"True":'False';
};
IFormat.prototype.normalize = function (v) {
	return (this.normalizer==0 ? null : v/this.normalizer);
};
IFormat.prototype.percent = function (v) {
	return 100*this.normalize(v);
};
IFormat.prototype.percent = IFormat.prototype.percentage;
