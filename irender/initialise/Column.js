function Column() {
	for(let i=0;i<arguments.length;i++) 
		Object.assign(this,arguments[i]);
	this.iFormat=new IFormat();
	if(!this.column) this.column=this.name;
	if(!this.title) this.title=this.name;
	if(!this.type) this.type="string";
}
Column.prototype.isMeasure = function() {
	return this.iFormat.isMeasure(this.type);
};
Column.prototype.appendCellTitle = function(row,css) {
	css.createElement(row,"TD","Head").appendChild(document.createTextNode(this.title));
};
Column.prototype.appendCellData = function(row,css,dataRow) {
	css.createElement(row,"TD","Cell").appendChild(this.iFormat.toHTML(dataRow[this.offset]));
};
