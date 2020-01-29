function IChartStack(chart){
	this.chart=chart;
}
IChartStack.prototype.draw=function() {
	const axis=this.chart.chart.axis
		rect={action:"rect",width:this.chart.barWidth,stroke:this.chart.outline,"stroke-width":this.chart.lineWidth};
	this.chart.drawAxisY();
	this.chart.barWidth=this.tickIncrement;
	for(let i=0; i<this.data.length; i++) {
		const xPos=this.chart.axis.x.position+Math.floor((i+0.5)*this.tickIncrement);
		const total=axis.y.columns.reduce((c,a)=>a+(c.getRow(i)||0),0);
		let yPos=this.chart.axis.y.position-this.scaleY(total);
		axis.y.columns.forEach(c=>{
			const y=c.getScaledRow(i);
			this.chart.graph(rect,{x:xPos,y:yPos,height:y,stroke:this.outline=="none"?c.color:this.chart.outline,fill:c.color});
			yPos+=y;
		});
	}
};
IChartStack.prototype.getCoordsPoints=function(xPOs,yPos) {
	return ["x: ??","y: ??"];
};
