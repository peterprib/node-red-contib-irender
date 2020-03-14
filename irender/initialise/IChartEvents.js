function IChartEvents(chart) {
	this.chart=chart;
}
IChartEvents.prototype.draw=function(data) {
	const colX=this.axis.x.column.offset,
		line={action:"line",y1:0,y2:this.chart.axis.y.position,stroke:"red","stroke-width":this.lineWidth,"fill-opacity":0.8};
	axis.x.draw();
	for(let j=0 ; j<data.length; j++) {
		const dataX=data[j][colX];
		if(dataX==null || isNaN(dataX) ) continue;
		const plotX=this.xPositionScale(dataX);
		this.graph(line,{x1:plotX,x2:plotX});
	}
};
IChartEvents.prototype.getCoordsPoints=function(x) {
	const xBase=this.chart.getRatioBase(x, this.offset,this.ratio);
	return this.data.filter(row=>xBase.inRange(row[colX])).map((row,i)=>
		"event: "+this.axis.y.columns.map(c=>getAbbreviated(i)).join(" ")
	);

};
IChartEvents.prototype.checkOptions=function() {
	this.chart.checkExists(this.axis.y.column.name,'Missing parameter chart.axis.y.column.name');
};
