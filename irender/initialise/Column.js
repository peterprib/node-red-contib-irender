function Column() {
	for(let i=0;i<arguments.length;i++) 
		Object.assign(this,arguments[i]);
//	this.iFormat=new IFormat();
	if(!this.column) this.column=this.name;
	if(!this.title) this.title=this.name;
	if(!this.type)
		this.type=this.data||this.data.length?typeof this.data[0][this.offset]:"string";
}
Column.prototype.appendCellTitle = function(row,css) {
	css.createElement(row,"TD","Head").appendChild(document.createTextNode(this.title));
};
Column.prototype.appendCellData = function(row,css,dataRow) {
	css.createElement(row,"TD","Cell").appendChild(iFormat.toHTML(dataRow[this.offset]));
};
Column.prototype.getAbbreviated = function(i) {
	if(!this.formatAbbreviateFunction)
		this.formatAbbreviateFunction=iFormat.getFormatAbbreviatedFunction(this.type);
	return this.formatAbbreviateFunction(this.data[i][this.offset],this.precision);
};
Column.prototype.getAbbreviatedValue = function(value) {
	if(!this.formatAbbreviateFunction)
		this.formatAbbreviateFunction=iFormat.getFormatAbbreviatedFunction(this.type);
	return this.formatAbbreviateFunction(value,this.precision);
};
Column.prototype.getAvg = function() {
	if(this.avg==null)
		this.avg=this.sum(d)/this.columnData.length;
	return this.avg;
};
Column.prototype.getColumnData = function() {
	if(!this.columnData)
		this.columnData=this.data.map(r=>r[this.offset]);
	return this.columnData;
};
Column.prototype.getCount = function() {
	return this.data.length
};
Column.prototype.getDataRow = function(i) {
	return (this.columnData||this.getColumnData())[i];
};
Column.prototype.getDataFirst = function() {
	return (this.columnData||this.getColumnData())[0];
};
Column.prototype.getDataLast = function() {
	return (this.columnData||this.getColumnData())[this.columnData.length-1];
};
Column.prototype.getDeltaData = function() {
	if(!this.delta && this.isMeasure())
		this.delta=this.getColumnData().map((cell,index,arr)=>arr[index+1]-arr[index]);
	return this.delta;
};
Column.prototype.getFormatted = function(i) {
	if(!this.formatfunction)
		this.formatfunction=iFormat.getFormatFunction(this.type);
	return this.formatFunction((this.columnData||this.getColumnData())[i],this.precision);
};
Column.prototype.getFormattedInRow = function(row) {
	if(!this.formatfunction)
		this.formatfunction=iFormat.getFormatFunction(this.type);
	return this.formatFunction(row[this.offset],this.precision);
};
Column.prototype.getFormattedValue = function(v) {
	if(!this.formatfunction)
		this.formatfunction=iFormat.getFormatFunction(this.type);
	return this.formatFunction(v,this.precision);
};
Column.prototype.getMax = function() {
	if(this.max==null)
		this.max=Math.max(...this.getColumnData());
	return this.max;
};
Column.prototype.getMin = function() {
	if(this.min==null)
		this.min=Math.min(...this.getColumnData());
	return this.min;
};
Column.prototype.getNormalizedData = function() {
	if(!this.normalizedData) {
		const range=this.getRange();
		if(range) {
			const avg=this.getAvg(),
				offset=range/avg;
			this.normalizedData=this.getColumn.data.map(c=>c/range-offset);
		} else
			this.normalizedData=this.getColumn.data.map(c=>0);
	}
	return this.normalizedData;
};
Column.prototype.getPointsNear = function(value,points) {
	const min=value-5,max=value+5,columnData=(this.columnData||this.getColumnData());
	if(points) return points.filter(i=>{const c=columnData[i]; return c>min&&c<max});
	let pointsFound=[];
	columnData.forEach((c,i)=>{if(c>min&&c<max) pointsFound.push(i)});
	return pointsFound;
};
Column.prototype.getRange = function() {
	if(this.range==null)
		this.range=this.getMax()-this.getMin();
	return this.range;
};
Column.prototype.getRatio = function() {
	if(this.ratio==null)
		this.ratio=this.getMax()/this.getRange();
	return this.ratio;
};
Column.prototype.getRow = function(i) {
	return (this.columnData||this.getColumnData())[i];
};
Column.prototype.getScaledRow = function(i) {
	return (this.columnData||this.getColumnData())[i]*(this.ratio||this.getRatio());
};
Column.prototype.getString = function(i) {
	if(!this.format)
		this.formatfunction=iFormat.getFormatFunction(this.type);
	this.formatFunction(this.data[i][this.offset],this.precision);
};
Column.prototype.getSum = function() {
	if(this.sum==null)
		this.sum=(this.columnData||this.getColumnData()).reduce((c,a)=>c+a, this.isMeasure()?0:"")
	return this.sum;
};
Column.prototype.isDateTime = function() {
	return iFormat.isDateTime(this.type);
};
Column.prototype.isInRange = function(value) {
	return value>= (this.min||this.getMin()) || value <= (this.max||this.getMax());
};
Column.prototype.isMeasure = function() {
	return iFormat.isMeasure(this.type);
};
Column.prototype.isTimestamp = function() {
	return iFormat.isString(this.type);
};
Column.prototype.isTimestamp = function() {
	return iFormat.isTimestamp(this.type);
};
/*
Column.prototype.setPositionOffset = function(value) {
	this.positionOffset=value+this.scale(this.getMin());
	return this;
};
*/
Column.prototype.setRatio = function(value) {
	this.ratio=value;
	return this
};
Column.prototype.scale = function(value) {
	return value*(this.ratio||this.getRatio());
};
Column.prototype.scaleExponential=function(value){
	const ratio=this.ratio||this.getRatio();
	return value==0
		?0
		:value>0
			?Math.log(value*ratio)
			:-Math.log(-value*ratio);
};
