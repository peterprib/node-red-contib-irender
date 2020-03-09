function IChartBar(chart) {
	this.chart=chart;
}
IChartBar.prototype.isCartezian=true;
IChartBar.prototype.draw=function () {
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
	const barWidth=barRange/yColumnCount;
	axis.x.adjustRange(barRange);
	const startAdjustment=yColumnCount*barWidth/2;
	axis.x.draw();
	axis.y.draw();
	const rectBase={action:"rect",width:axis.x.scale(barWidth),"stroke-width":this.lineWidth}
	this.chart.dataStore.data.forEach((row,i)=>{
		const x=row[xOffset];
		let xAdjusted=x-startAdjustment
		axis.y.columns.forEach((column,j)=>{
			const data=row[column.offset],
				xPos=axis.x.getPosition(xAdjusted);
			if(data==null) return;
			const yPos=axis.y.getPosition(data);
			this.chart.graph(rectBase,{x:xPos,y:yPos,height:axis.x.position-yPos,stroke:(outline||column.color),
				fill:column.color,
				title:x+" " +column.title+" : "+data
			});
			xAdjusted+=barWidth;
		});
	});
	axis.y.columns.forEach(c=>this.chart.addLegendRow({},c.title,c.color));
};
IChartBar.prototype.getCoordsPoints=function(xPos,yPos) {
};
IChartBar.prototype.showError=function(xPOs,yPos) {
};
IChartBar.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Chart Type","chart.type","bar","stack")];
};