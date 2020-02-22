function IChartBar(chart) {
	this.chart=chart;
}
IChartBar.prototype.isCartezian=true;
IChartBar.prototype.drawChart_bar=function () {
	const yDetails=this.chart.axis.y.columns,
		xAxis=this.chart.axis.x,
		outline=this.chart.outline==="none"?null:this.chart.outline,
		data=this.chart.dataStore.data,
		tickIncrement=this.chart.tickIncrement;
	this.barWidth=Math.floor(tickIncrement/yDetails.size);
	this.chart.dataStore.data.forEach((row,i)=>{
		this.chart.axis.y.columns.forEach((column,j)=>{
			const data=row[column.offset];
			if(data==null) continue;
			const xPos=xAxis.position+Math.floor((i+0.5)*tickIncrement)+(j-1)*this.barWidth;
			const yPos=this.yPositionScale(data);
			this.graph({action:"rect",x:xPos,y:yPos,width:this.barWidth,
				height:this.chart.axis.y.position-yPos,
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