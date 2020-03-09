function IChartStack(chart){
	this.chart=chart;
}
IChartStack.prototype.isCartezian=true;
IChartStack.prototype.draw=function () {
	const axis=this.chart.axis,
		outline=(this.chart.outline==="none"?null:this.chart.outline),
		data=this.chart.dataStore.data,
		yColumnCount=axis.y.columns.length,
		observations=axis.x.getCount(),
		xOffset=axis.x.column.offset,
		tickIncrement=this.chart.tickIncrement;
	if(observations==0) throw Error("over lapping x axis values");
	const barRange=observations>1?axis.x.getMinDelta():axis.x.getMin();
	if(barRange==0) throw Error("over lapping x axis values");
	const barWidth=barRange;
	const startAdjustment=barWidth/2;
	axis.y.setMax(this.chart.dataStore.getMaxRowSum(axis.y.columns));
	axis.x.adjustRange(barRange);
	axis.x.draw();
	axis.y.draw();
	const rectBase={action:"rect",width:axis.x.scale(barWidth),"stroke-width":this.lineWidth}
	this.chart.dataStore.data.forEach((row,i)=>{
		const x=row[xOffset],
			xPos=axis.x.getPosition(x-startAdjustment);
		let yAdjusted=0,yPos=axis.y.getPosition(0);
		axis.y.columns.forEach((column,j)=>{
			const data=row[column.offset];
			if(data==null) return;
			yAdjusted+=data;
			yPosNext=axis.y.getPosition(yAdjusted);
			const height=yPos-yPosNext;
			yPos=yPosNext;
			this.chart.graph(rectBase,{x:xPos,y:yPos,height:height,stroke:(outline||column.color),
				fill:column.color,
				title:x+" " +column.title+" : "+data
			});
		});
	});
	axis.y.columns.forEach(c=>this.chart.addLegendRow({},c.title,c.color));
};
IChartStack.prototype.getCoordsPoints=function(xPos,yPos) {
};
IChartStack.prototype.showError=function(xPOs,yPos) {
};
IChartStack.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Chart Type","chart.type","bar","stack")];
};