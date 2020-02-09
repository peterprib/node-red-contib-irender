function IChartBubble(chart){
	this.chart=chart;
//	this.chart.checkExists(axis.z.name,'Missing parameter axis.z.name');
/*	
	const columnZ=this.chart.axis.z.column;
	const rangeZ=columnZ.getRange();
	if(rangeZ==0) {
		rangeZ=zDetails.getMin();
		this.zRatioOffset==0;
	} else 
		this.zRatioOffset=this.zDataMin;
	this.zRatio=this.bubbleRatio*(Math.min(this.yMax,this.xMax)/rangeZ);
	if(this.zRatio==Infinity) this.zRatio=this.bubbleRatio;
	if(isNaN(this.zRatio)) throw "z ratio calculation error, charting width:"+ zDetails.getMin() + " max:"+ Math.max.apply(Math,this.columnIndexDetails.z.dataMax) + " min:"+ zDetails.getMax());
*/
}
IChartBubble.prototype.isCartezian=true;
IChartBubble.prototype.draw=function() {
	const transparency=0.8,
		zChartRange=Math.min(this.chart.width,this.chart.height)/4;
		axis=this.chart.axis,
		zColumns=axis.z.columns,
		offsetX=axis.x.column.offset,
		offsetY=axis.y.column.offset,
		base={action:"circle",stroke:(this.outline==="none"?columnZ.color:this.outline),"stroke-width":1,"fill-opacity":0.5};
	zColumns.forEach(c=>c.ratio=zChartRange/c.getRange());
	axis.x.draw();
	axis.y.draw();
	this.chart.dataStore.data.forEach(row=>{
		const x=axis.x.getPosition(row[offsetX]),
			y=axis.y.getPosition(row[offsetY]);
		zColumns.map(c=>{
			return {color:c.color,z:c.ratio*row[c.offset]};
		}).sort((a,b)=>b.z-a.z)
		.forEach(c=>{
			this.chart.graph({cx:x,cy:y,r:c.z,fill:c.color},base);
		});
	});
};
IChartBubble.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Y Scaling","chart.axis.y.scale.type","AUTO","EXPONENTIAL")];

};
IChartLine.prototype.getCoordsPoints=function(xPos,yPos) {
	throw Error("to be done");
};