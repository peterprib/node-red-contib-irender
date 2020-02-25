function IChartBar(chart) {
	this.chart=chart;
}
IChartBar.prototype.isCartezian=true;
IChartBar.prototype.draw=function () {
	const axis=this.chart.axis,
		outline=(this.chart.outline==="none"?null:this.chart.outline),
		data=this.chart.dataStore.data,
		tickIncrement=this.chart.tickIncrement;
	axis.x.draw();
	axis.y.draw();
	
	
	
	
	this.barWidth=Math.floor(tickIncrement/axis.y.getRange);  // several columns at a location  must get diff and
	this.chart.dataStore.data.forEach((row,i)=>{
		axis.y.columns.forEach((column,j)=>{
			const data=row[column.offset];
			if(data==null) return;
			const xPos=axis.x.position+Math.floor((i+0.5)*tickIncrement)+(j-1)*this.barWidth;
			const yPos=axis.y.getPosition(data);
			this.chart.graph({action:"rect",x:xPos,y:yPos,width:this.barWidth,
				height:axis.y.position-yPos,
				stroke:(outline||column.color),
				"stroke-width":this.lineWidth,
				fill:column.color
			});
		});
	});
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