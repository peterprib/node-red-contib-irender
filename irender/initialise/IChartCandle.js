function IChartCandle(chart){
	this.chart=chart;
}
IChartCandle.prototype.isCartezian=true;
IChartCandle.prototype.draw=function() {
	this.chart.addExperimental();
	
	const transparency=0.8,
//		yChartRange=Math.min(this.chart.width,this.chart.height)/4;
		axis=this.chart.axis,
		yColumns=axis.y.columns,
		offsetX=axis.x.column.offset,
		offsetYHigh=yColumns[0].offset,
		offsetYLow=yColumns[1].offset,
		colorLow={fill:axis.y.columns[0].color,stroke:(this.outline==="none"?axis.y.columns[0].color:this.outline)};
		colorHigh={fill:axis.y.columns[1].color,stroke:(this.outline==="none"?axis.y.columns[1].color:this.outline)};
		base={action:"rect",width:5,"stroke-width":1,"fill-opacity":0.5};
	
//	zColumns.forEach(c=>c.ratio=zChartRange/c.getRange());
	axis.x.draw();
	axis.y.draw();
	this.chart.dataStore.data.forEach(row=>{
		const x=row[offsetX],high=row[offsetYHigh],low=row[offsetYLow],
			xPos=axis.x.getPosition(x),
			yHigh=axis.y.getPosition(high),
			yLow=axis.y.getPosition(low);
		if(yHigh>yLow) {
			this.chart.graph(base,colorHigh,{x:xPos,y:yLow,height:yHigh-yLow,title:'x: '+x+' high: '+high+' low: '+low});
		} else {
			this.chart.graph(base,colorHigh,{x:xPos,y:yHigh,height:yLow-yHigh,title:'x: '+x+' high: '+low+' low: '+high});
		}
	});
	this.chart.addLegendRow({},"x axis: " + axis.x.column.title);
	this.chart.addLegendRow({},"y axis: " + axis.y.column.title);
};
IChartCandle.prototype.getMenuOptions=function() {
};
IChartCandle.prototype.getCoordsPoints=function(xPos,yPos) {
};