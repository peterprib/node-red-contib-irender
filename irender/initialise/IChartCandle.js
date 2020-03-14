function IChartCandle(chart){
	this.chart=chart;
}
IChartCandle.prototype.isCartezian=true;
IChartCandle.prototype.draw=function() {
	const transparency=0.8,
		zChartRange=Math.min(this.chart.width,this.chart.height)/4;
		axis=this.chart.axis,
		zColumns=axis.z.columns,
		offsetX=axis.x.column.offset,
		offsetYHigh=axis.y.column[0].offset,
		offsetYLow=axis.y.column[1].offset,
		base={action:"rect",width:5,stroke:(this.outline==="none"?columnZ.color:this.outline),"stroke-width":1,"fill-opacity":0.5};
	
	zColumns.forEach(c=>c.ratio=zChartRange/c.getRange());
	axis.x.draw();
	axis.y.draw();
	this.chart.dataStore.data.forEach(row=>{
		const x=row[offsetX],high=row[offsetY],low=row[offsetY],
			xPos=axis.x.getPosition(x),
			yHigh=axis.y.getPosition(high),
			yLow=axis.y.getPosition(low);
		this.chart.graph(base,{x:xPos,y:y,r:c.z,title:'x: '+x+' high: '+high+' low: '+low});
	});
	this.chart.addLegendRow({},"x axis: " + axis.x.column.title);
	this.chart.addLegendRow({},"y axis: " + axis.y.column.title);
	axis.z.columns.forEach(c=>this.chart.addLegendRow({},c.title,c.color));
};
IChartCandle.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Y Scaling","chart.axis.y.scale.type","AUTO","EXPONENTIAL")];
};
IChartCandle.prototype.getCoordsPoints=function(xPos,yPos) {
	const axis=this.chart.axis,
		columnX=axis.x.column;
	let y=this.chart.offset - yPos;
	if(["FIXED","AUTO"].includes(axis.y.scale.type)) {
	} else if(!this.chart.axis.y.scale.type=="NOAXIS") {
		this.chart.insertCell(this.chart.addDetailXY(),
			...["x: "+this.dataToString(0,xBase.plot),"y: "+this.dataToString(1,yBase.plot)]);
	}
	this.chart.dataStore.data.forEach(row=>{
		zColumns.forEach(c=>{
			const radius=c.ratio*row[c.offset];
			const xPoints=columnX.getPointsNear(axis.x.getPositionValue(xPos),null,radius);
			axis.y.columns.forEach((column)=>{
				column.getPointsNear(axis.x.getPositionValue(yPos),xPoints,radius).forEach(i=>{
					this.chart.insertCell(this.chart.addDetailXY(),column.title,"x: "+columnX.getFormatted(i),"y: "+column.getFormatted(i));
				});
			});
		});
	});
};