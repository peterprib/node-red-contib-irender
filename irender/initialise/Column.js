function Column() {
	for(let i=0;i<arguments.length;i++) 
		Object.assign(this,arguments[i]);
	this.iFormat=new IFormat();
	if(!this.column) this.column=this.name;
	if(!this.title) this.title=this.name;
	if(!this.type)
		this.type=this.data||this.data.length?typeof this.data[0][this.offset]:"string";
}
Column.prototype.appendCellTitle = function(row,css) {
	css.createElement(row,"TD","Head").appendChild(document.createTextNode(this.title));
};
Column.prototype.appendCellData = function(row,css,dataRow) {
	css.createElement(row,"TD","Cell").appendChild(this.iFormat.toHTML(dataRow[this.offset]));
};
Column.prototype.getAbbreviated = function(i) {
	this.format=getFormatAbbreviatedFunction
	if(!this.formatAbbreviateFunction)
		this.formatAbbreviate=IFormat.getFormatAbbreviatedFunction(this.type);
	this.this.formatAbbreviate(this.data[i][this.offset],this.precision);
};
Column.prototype.getAvg = function() {
	if(!this.avg)
		this.avg=this.sum(d)/this.columnData.length;
	return this.avg;
}
Column.prototype.getColumnData = function() {
	if(!this.columnData)
		this.columnData=this.data.map(r=>r[this.offset]);
	return this.columnData;
};
Column.prototype.getDelta = function() {
	if(!this.delta && this.isMeasure())
		this.delta=this.getColumnData().map((cell,index,arr)=>arr[index+1]-arr[index]);
	return this.delta;
};
Column.prototype.getMax = function() {
	if(!this.max)
		this.max=Math.max(...this.getColumnData());
	return this.max;
};
Column.prototype.getMin = function() {
	if(!this.min)
		this.min=Math.min(...this.getColumnData());
	return this.min;
};
Column.prototype.getRange = function() {
	if(!this.range)
		this.range=this.getMax()-this.getMin();
	return this.range;
};
Column.prototype.getSum = function() {
	if(!this.sum)
		this.min=this.getColumnData.xs.reduce((c,a)=>c+a, this.isMeasure()?0:"")
	return this.sum;
};
Column.prototype.isMeasure = function() {
	return this.iFormat.isMeasure(this.type);
};
Column.prototype.isTimestamp = function() {
	return this.iFormat.isString(this.type);
};
Column.prototype.isTimestamp = function() {
	return this.iFormat.isTimestamp(this.type);
};