function IChartStack(chart){
	this.chart=chart;
}
IChartStack.prototype.isCartezian=true;
IChartStack.prototype.draw=function() {
	this.barWidth=this.tickIncrement;
	const axis=this.chart.axis,
		outline=this.chart.outline=="none"?null:this.outline;
		rect={action:"rect",width:this.barWidth,stroke:this.chart.outline,"stroke-width":this.chart.lineWidth};
	axis.x.draw();
	axis.y.draw();
	for(let i=0; i<this.chart.dataStore.data.length; i++) {
		const xPos=axis.x.position+Math.floor((i+0.5)*this.tickIncrement);
		const total=axis.y.columns.reduce((a,c)=>a+(c.getRow(i)||0),0);
		let yPos=axis.y.getPosition(total);
		axis.y.columns.forEach(c=>{
			const y=c.getScaledRow(i);
			this.chart.graph(rect,{x:xPos,y:yPos,height:y,stroke:(outline||c.color),fill:c.color,title:c.title});
			yPos+=y;
		});
	}
};
IChartStack.prototype.getCoordsPoints=function(xPOs,yPos) {
	return ["x: ??","y: ??"];
};
IChartStack.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Chart Type","chart.type","bar","stack")];
};