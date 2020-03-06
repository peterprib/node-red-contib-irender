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
	let barWidth;
	if(observations==0) throw Error("over lapping x axis values");
	if(observations>1) {
		const barRange=axis.x.getMinDelta();
		if(barRange==0) throw Error("over lapping x axis values");
		barWidth=barRange/yColumnCount;
		axis.x.adjustRange(barRange);
	} else {
		const barRange=axis.x.getMin();
	}
	const startAdjustment=yColumnCount*barWidth/2;
	axis.x.draw();
	axis.y.draw();
	
//	this.barWidth=Math.floor(tickIncrement/axis.y.getRange());  // several columns at a location  must get diff and
	this.chart.dataStore.data.forEach((row,i)=>{
//		const xPos=axis.x.position+Math.floor((i+0.5)*tickIncrement)+(j-1)*this.barWidth;
		const x=row[xOffset];
		let xAdjusted=x-startAdjustment
		axis.y.columns.forEach((column,j)=>{
			const data=row[column.offset],
				xPos=axis.x.getPosition(xAdjusted);
			if(data==null) return;
			const yPos=axis.y.getPosition(data);
			this.chart.graph({action:"rect",x:xPos,y:yPos,width:barWidth,
				height:axis.x.position-yPos,
				stroke:(outline||column.color),
				"stroke-width":this.lineWidth,
				fill:column.color,
				title:x+" " +column.title+" : "+data
			});
			xAdjusted+=barWidth;
		});
	});
};
IChartPie.prototype.getCoordsPoints=function(xPos,yPos) {
};
IChartEvents.prototype.showError=function(xPOs,yPos) {
};
IChartEvents.prototype.getCoordsPoints=function(xPOs,yPos) {
	const x=Math.floor((xPos - this.chart.axis.x.position)/this.tickIncrement-0.5);
	return ["x:",this.chart.axis.x.column.isDateTime()
		?this.dataToString(0,(xPos -this.xOffset)/this.chart.axis.x.getRatio())
				:this.chart.dataStore.data[x][colX],
		"y: "+this.dataToString(1,(this.yOffset-yPos)/this.yRatio)
	]
};
IChartBar.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Chart Type","chart.type","bar","stack")];
};