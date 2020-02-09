function IChartBar(){
	
}
IChartBar.prototype.isCartezian=true;
IChartBar.prototype.drawChart_bar=function () {
	const yDetails=this.columnIndexDetails.y;
	this.barWidth=Math.floor(this.tickIncrement/yDetails.size);
	for(let j,i=0; i<this.data.length; i++) {
		for(j=yDetails.y.start; j<yDetails.y.end; j++) {
			const d=this.data[i][j];
			if(d==null) continue;
			const xPos=this.chart.axis.x.position+Math.floor((i+0.5)*this.tickIncrement)+(j-1)*this.barWidth;
			const yPos=this.yPositionScale(d);
			this.graph({action:"rect",x:xPos,y:yPos,width:this.barWidth,
				height:this.chart.axis.y.position-yPos,
				stroke:(this.outline==="none"?this.colors[j]:this.outline),
				"stroke-width":this.lineWidth,
				fill:this.colors[j]
			});
		}
	}
};
IChartEvents.prototype.getCoordsPoints=function(xPOs,yPos) {
	const x=Math.floor((xPos - this.chart.axis.x.position)/this.tickIncrement-0.5);
	return ["x:",this.chart.axis.x.column.isDateTime()
		?this.dataToString(0,(xPos -this.xOffset)/this.chart.axis.x.getRatio())
				:this.data[x][colX],
		
		"y: "+this.dataToString(1,(this.yOffset-yPos)/this.yRatio)
	]

};

IChartBar.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Chart Type","chart.type","bar","stack")];
};